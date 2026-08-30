/* ============================================================================
 * Nudos — service worker (escrito a mano, sin dependencias)
 * ----------------------------------------------------------------------------
 * Offline para contenido ya visitado:
 *  - Navegaciones: network-first con fallback al shell cacheado (la app es SPA,
 *    así que con el shell + JS en caché cualquier ruta funciona sin conexión).
 *  - Assets estáticos (/assets, /icons, favicon, manifest): cache-first
 *    (llevan hash en el nombre, son inmutables).
 *  - Datos/media de Supabase: stale-while-revalidate.
 * ========================================================================== */

const VERSION = 'v1'
const SHELL_CACHE = `nudos-shell-${VERSION}`
const ASSET_CACHE = `nudos-assets-${VERSION}`
const DATA_CACHE = `nudos-data-${VERSION}`

const SHELL_URL = '/'
const PRECACHE = [SHELL_URL, '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL_CACHE, ASSET_CACHE, DATA_CACHE])
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname === '/favicon.svg' ||
      url.pathname === '/manifest.webmanifest')
  )
}

function isSupabase(url) {
  return url.hostname.endsWith('.supabase.co')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // 1) Navegaciones → network-first, fallback al shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put(SHELL_URL, copy))
          return res
        })
        .catch(() => caches.match(SHELL_URL).then((r) => r || caches.match(request))),
    )
    return
  }

  // 2) Assets estáticos → cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone()
            caches.open(ASSET_CACHE).then((c) => c.put(request, copy))
            return res
          }),
      ),
    )
    return
  }

  // 3) Supabase → stale-while-revalidate
  if (isSupabase(url)) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              if (res && res.status === 200) cache.put(request, res.clone())
              return res
            })
            .catch(() => cached)
          return cached || network
        }),
      ),
    )
  }
})
