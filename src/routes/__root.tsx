import { useEffect } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: 'Nudos — Pulseras de hilo' },
      {
        name: 'description',
        content: 'Aprende a hacer pulseras de hilo en macramé, paso a paso.',
      },
      { name: 'theme-color', content: '#c56b4a' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Nudos' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.webmanifest' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/icons/icon-192.png' },
    ],
  }),
  component: RootComponent,
})

const TABS = [
  { to: '/', label: 'Inicio', icon: '⌂' },
  { to: '/nudos', label: 'Nudos', icon: '➰' },
  { to: '/patrones', label: 'Patrones', icon: '▤' },
  { to: '/mis-proyectos', label: 'Proyectos', icon: '❑' },
  { to: '/perfil', label: 'Perfil', icon: '☺' },
] as const

function RootComponent() {
  // Registro del service worker (solo en cliente, solo en producción).
  useEffect(() => {
    if (import.meta.env.DEV) return
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* PWA opcional: no romper si el registro falla */
    })
  }, [])

  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="app">
          <header className="app__header">
            <Link to="/" className="app__brand">
              Nudos<span className="app__brand-dot">.</span>
            </Link>
          </header>

          <main className="app__main">
            <Outlet />
          </main>

          <nav className="tabbar" aria-label="Navegación principal">
            {TABS.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className="tabbar__item"
                activeProps={{ className: 'tabbar__item is-active' }}
                activeOptions={{ exact: tab.to === '/' }}
              >
                <span className="tabbar__icon" aria-hidden="true">
                  {tab.icon}
                </span>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
