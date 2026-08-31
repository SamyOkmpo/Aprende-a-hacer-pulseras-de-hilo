// Copia el shell SPA de TanStack Start a un index.html "normal".
// TanStack Start emite el shell como dist/client/_shell.html, pero Vercel no
// sirve de forma fiable archivos con guion bajo inicial. Con un index.html real:
//  - "/" se sirve solo (sin rewrite)
//  - el rewrite catch-all apunta a /index.html para las rutas profundas
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const clientDir = resolve(here, '../dist/client')
const shell = resolve(clientDir, '_shell.html')
const index = resolve(clientDir, 'index.html')

if (!existsSync(shell)) {
  console.error('[spa-index] No se encontró dist/client/_shell.html. ¿Está activado spa en vite.config.ts?')
  process.exit(1)
}

copyFileSync(shell, index)
console.log('[spa-index] ✓ dist/client/index.html creado a partir de _shell.html')
