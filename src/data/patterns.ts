// ============================================================================
// Datos semilla — patrones (pulseras) + pasos del modo práctica
// ============================================================================

import type { Dificultad } from './knots'

export type PatternStep = {
  orden: number
  descripcion: string
  repeticiones: number
  knotSlug?: string
}

export type Pattern = {
  id: string
  slug: string
  nombre: string
  dificultad: Dificultad
  descripcion: string
  imagenPortada?: string
  knotSlugs: string[]
  destacada?: boolean
  steps: PatternStep[]
}

export const PATTERNS: Pattern[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    slug: 'pulsera-espiral-terracota',
    nombre: 'Pulsera espiral terracota',
    dificultad: 'principiante',
    destacada: true,
    descripcion:
      'Una pulsera de una sola técnica, perfecta para empezar: se monta, se hace espiral y se cierra. En una tarde la tienes lista.',
    imagenPortada: undefined,
    knotSlugs: ['nudo-de-alondra', 'nudo-espiral', 'nudo-plano'],
    steps: [
      {
        orden: 1,
        descripcion: 'Corta 2 hilos guía de 40 cm y 2 hilos de trabajo de 90 cm.',
        repeticiones: 1,
      },
      {
        orden: 2,
        descripcion: 'Monta los hilos de trabajo sobre los guía con un nudo de alondra.',
        repeticiones: 1,
        knotSlug: 'nudo-de-alondra',
      },
      {
        orden: 3,
        descripcion: 'Haz un nudo plano completo para fijar el arranque.',
        repeticiones: 1,
        knotSlug: 'nudo-plano',
      },
      {
        orden: 4,
        descripcion: 'Haz medios nudos en el mismo sentido hasta lograr la espiral. Cuenta cada medio nudo.',
        repeticiones: 30,
        knotSlug: 'nudo-espiral',
      },
      {
        orden: 5,
        descripcion: 'Cierra con un nudo plano y remata las puntas con un nudo corredizo.',
        repeticiones: 1,
        knotSlug: 'nudo-plano',
      },
    ],
  },
]

export function getPattern(slug: string): Pattern | undefined {
  return PATTERNS.find((p) => p.slug === slug)
}
