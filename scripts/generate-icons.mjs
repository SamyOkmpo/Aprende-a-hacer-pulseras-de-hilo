// Genera los íconos PWA (PNG) sin dependencias externas, usando zlib nativo.
// Dibuja un "nudo" minimalista: un anillo (loop) claro sobre fondo terracota.
// Uso: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '../public/icons')
mkdirSync(outDir, { recursive: true })

// Paleta (coincide con el sistema de diseño)
const BG = [0xc5, 0x6b, 0x4a] // terracota
const FG = [0xfa, 0xf8, 0xf5] // papel

// CRC32 (tabla)
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function drawIcon(size, { padding }) {
  const cx = size / 2
  const cy = size / 2
  // Anillo del "nudo"
  const usable = size * (1 - padding * 2)
  const rOuter = usable / 2
  const rInner = rOuter * 0.56
  const rowBytes = size * 4 + 1 // +1 filtro por fila
  const raw = Buffer.alloc(rowBytes * size)

  for (let y = 0; y < size; y++) {
    raw[y * rowBytes] = 0 // filtro None
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx
      const dy = y + 0.5 - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      // antialias suave en los bordes del anillo
      const inRing = dist <= rOuter && dist >= rInner
      let color = BG
      let alpha = 255
      if (inRing) {
        color = FG
        const edge = Math.min(rOuter - dist, dist - rInner)
        alpha = 255
        if (edge < 1.5) {
          // mezcla en el borde
          const t = Math.max(0, Math.min(1, edge / 1.5))
          color = [
            Math.round(FG[0] * t + BG[0] * (1 - t)),
            Math.round(FG[1] * t + BG[1] * (1 - t)),
            Math.round(FG[2] * t + BG[2] * (1 - t)),
          ]
        }
      }
      const off = y * rowBytes + 1 + x * 4
      raw[off] = color[0]
      raw[off + 1] = color[1]
      raw[off + 2] = color[2]
      raw[off + 3] = alpha
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

const targets = [
  { file: 'icon-192.png', size: 192, padding: 0.2 },
  { file: 'icon-512.png', size: 512, padding: 0.2 },
  { file: 'icon-maskable-512.png', size: 512, padding: 0.3 }, // más margen para safe-zone
]

for (const t of targets) {
  writeFileSync(resolve(outDir, t.file), drawIcon(t.size, { padding: t.padding }))
  console.log('✓', t.file)
}
