import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// El destino de deploy (Vercel / Cloudflare Workers) se autodetecta en la
// plataforma de hosting a partir del build; no requiere configuración aquí.
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // TanStack Start (SSR + file-based routing). Debe ir antes que viteReact.
    tanstackStart(),
    viteReact(),
    // PWA: manifest + service worker con caché offline de contenido visitado.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      // TanStack Start hace SSR: no precacheamos el HTML (cambia por request),
      // sí los assets estáticos + caché en runtime de nudos/patrones visitados.
      workbox: {
        globPatterns: ['**/*.{js,css,svg,png,ico,woff2}'],
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Navegaciones (páginas SSR de nudos/patrones ya visitados).
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nudos-paginas',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Datos y media desde Supabase (imágenes/portadas/diagramas).
            urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'nudos-supabase',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Nudos — Pulseras de hilo',
        short_name: 'Nudos',
        description: 'Aprende a hacer pulseras de hilo en macramé, paso a paso.',
        lang: 'es',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#faf8f5',
        theme_color: '#c56b4a',
        categories: ['education', 'lifestyle'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
