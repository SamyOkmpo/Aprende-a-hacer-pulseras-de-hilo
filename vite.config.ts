import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// El destino de deploy (Vercel / Cloudflare Workers) se autodetecta en la
// plataforma de hosting a partir del build; no requiere configuración aquí.
// PWA: el manifest y el service worker viven en /public (estáticos) y se
// copian tal cual al build. El SW se registra en src/routes/__root.tsx.
export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    // TanStack Start en modo SPA: prerenderiza un "shell" estático y la app
    // hidrata/enruta en el cliente. Encaja con nuestro caso (datos desde
    // Supabase por anon key o semilla local + localStorage) y hace el deploy
    // en Vercel trivial: solo archivos estáticos, sin función serverless.
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
})
