# Nudos

PWA minimalista para **aprender a hacer pulseras de hilo en macramé**, paso a paso.
Proyecto personal de portafolio.

## Stack

- **TanStack Start** + TypeScript (SSR + file-based routing sobre Vite)
- **Supabase** (auth + base de datos, con Row Level Security)
- **PWA** instalable (manifest + service worker con caché offline de lo visitado)
- Deploy: repo en GitHub → **Vercel** (o Cloudflare Workers)

## Cómo correr

```bash
npm install
cp .env.example .env   # opcional: sin credenciales usa datos semilla locales
npm run dev            # http://localhost:3000
```

Sin Supabase configurado, la app funciona igual usando los **datos semilla**
locales (`src/data/`), ideal para desarrollar el frontend.

## Scripts

| comando            | qué hace                                  |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | servidor de desarrollo                    |
| `npm run build`    | build de producción                       |
| `npm run typecheck`| chequeo de tipos (`tsc --noEmit`)         |
| `node scripts/generate-icons.mjs` | regenera los íconos PWA    |

## Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, ejecuta `supabase/schema.sql` y luego `supabase/seed.sql`.
3. Copia la URL y la `anon key` del proyecto a tu `.env`:

   ```
   VITE_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
   VITE_SUPABASE_ANON_KEY="tu-anon-key"
   ```

El catálogo (`knots`, `patterns`, `pattern_steps`) es de **lectura pública**;
los datos de usuario (`user_projects`, `user_progress`) están protegidos por RLS
(cada usuario solo ve lo suyo).

## Estructura

```
src/
  routes/              # file-based routing (TanStack Router)
    __root.tsx         # shell: header + tab bar + PWA + <head>
    index.tsx          # / — home: destacadas + biblioteca
    nudos/index.tsx    # /nudos — biblioteca de nudos
    nudos/$slug.tsx    # /nudos/[slug] — detalle con diagrama animado (POC)
    patrones/…         # /patrones y /patrones/[slug] (modo práctica)
    mis-proyectos/…    # galería personal
    perfil/…           # auth / ajustes
  components/
    KnotDiagram.tsx    # SVG que se "dibuja" paso a paso (stroke-dashoffset)
    PracticeMode.tsx   # checklist + contador de repeticiones
  data/                # datos semilla (fuente de verdad del POC)
  lib/                 # cliente Supabase + repositorios (DB o semilla)
  styles/app.css       # sistema de diseño (tokens)
supabase/
  schema.sql           # tablas + RLS
  seed.sql             # datos de ejemplo
public/                # manifest (generado), favicon, íconos
```

## Diagramas animados de nudos

Cada nudo define `svgSteps`: una lista de pasos, y cada paso, uno o más trazos
SVG (`d`). `<KnotDiagram>` los "dibuja" animando `stroke-dashoffset` (con
`pathLength="1"` para no depender de la longitud real del trazo). Botones de
anterior/siguiente, puntos de progreso y "repetir". Respeta
`prefers-reduced-motion`.

## PWA / offline

- El manifest (`public/manifest.webmanifest`) y el service worker
  (`public/sw.js`) son estáticos y se copian tal cual al build. El SW se
  registra en `src/routes/__root.tsx` (solo en producción).
- Estrategia offline (SW escrito a mano, sin dependencias):
  - **Navegaciones**: network-first con fallback al *shell* cacheado. Como la
    app es SPA, con el shell + JS en caché **cualquier ruta ya visitada
    funciona sin conexión**.
  - **Assets** (`/assets`, `/icons`, favicon, manifest): cache-first (llevan
    hash, son inmutables).
  - **Datos/media de Supabase**: stale-while-revalidate.
- El SW no se registra en `dev`; pruébalo con `npm run build && npm run serve`.

## Deploy (Vercel)

La app se compila en **modo SPA** (`spa: { enabled: true }` en
`vite.config.ts`): TanStack Start prerenderiza un shell estático
(`dist/client/_shell.html`) y la app enruta/hidrata en el cliente. El deploy es
solo archivos estáticos, sin función serverless.

`vercel.json` ya deja todo configurado:

- `outputDirectory: dist/client`
- rewrite catch-all → `/_shell.html` (para que rutas profundas como
  `/nudos/nudo-plano` funcionen al recargar; Vercel sirve primero los archivos
  estáticos que existan)

> Si el proyecto en Vercel se creó antes con otros ajustes, borra cualquier
> **Output Directory / Build Command** fijado en el dashboard para que tome los
> de `vercel.json`.

Define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en las variables de
entorno del proyecto en Vercel (si no, la app usa la semilla local).

### Cloudflare Workers

Requiere un adaptador/target específico para el handler `fetch`
(`dist/server/server.js`). El modo SPA de arriba también puede servirse como
sitio estático en Cloudflare Pages con el mismo `dist/client` y un rewrite al
shell.
