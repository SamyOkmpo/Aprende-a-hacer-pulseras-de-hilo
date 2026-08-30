// ============================================================================
// Datos semilla — nudos base
// ----------------------------------------------------------------------------
// Fuente de verdad para el POC (funciona sin Supabase) y espejo de seed.sql.
// Los diagramas son esquemáticos: cada paso añade uno o más trazos SVG que el
// componente <KnotDiagram> "dibuja" con stroke-dashoffset. Las coordenadas
// usan un viewBox 0 0 200 200; pathLength se normaliza a 1 en el componente.
// ============================================================================

export type Dificultad = 'principiante' | 'intermedio' | 'avanzado'

export type KnotStepPath = {
  /** Atributo `d` del <path>. */
  d: string
  /** 'guia' = trazo de contexto (fino, tenue); 'cordon' = hilo (grueso, acento). */
  rol?: 'guia' | 'cordon'
}

export type KnotStep = {
  descripcion: string
  paths: KnotStepPath[]
}

export type Knot = {
  id: string
  slug: string
  nombre: string
  dificultad: Dificultad
  descripcion: string
  svgSteps: KnotStep[]
  videoUrl?: string
  orden: number
}

export const KNOTS: Knot[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'nudo-de-alondra',
    nombre: 'Nudo de alondra',
    dificultad: 'principiante',
    orden: 1,
    descripcion:
      'El nudo para montar hilos sobre un cordón base. Es casi siempre el punto de partida de una pulsera.',
    videoUrl: undefined,
    svgSteps: [
      {
        descripcion: 'Coloca el cordón base en horizontal. Sobre él montaremos el hilo de trabajo.',
        paths: [{ d: 'M 20 60 L 180 60', rol: 'guia' }],
      },
      {
        descripcion: 'Dobla el hilo de trabajo por la mitad y pásalo por detrás del cordón base.',
        paths: [{ d: 'M 100 60 C 100 90, 80 90, 80 120 M 100 60 C 100 90, 120 90, 120 120', rol: 'cordon' }],
      },
      {
        descripcion: 'Pasa las dos puntas por dentro del bucle y tira hacia abajo para ajustar.',
        paths: [{ d: 'M 80 120 C 80 140, 96 140, 96 170 M 120 120 C 120 140, 104 140, 104 170', rol: 'cordon' }],
      },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    slug: 'nudo-plano',
    nombre: 'Nudo plano',
    dificultad: 'principiante',
    orden: 2,
    descripcion:
      'El nudo cuadrado clásico del macramé. Con dos hilos de trabajo alrededor de dos hilos guía se forma una superficie plana y firme.',
    videoUrl: undefined,
    svgSteps: [
      {
        descripcion: 'Dos hilos guía en el centro y un hilo de trabajo a cada lado.',
        paths: [
          { d: 'M 90 20 L 90 180 M 110 20 L 110 180', rol: 'guia' },
          { d: 'M 40 30 L 40 60 M 160 30 L 160 60', rol: 'cordon' },
        ],
      },
      {
        descripcion: 'Pasa el hilo izquierdo por encima de los guía y por debajo del derecho.',
        paths: [{ d: 'M 40 60 C 70 60, 130 70, 160 60', rol: 'cordon' }],
      },
      {
        descripcion: 'Pasa el hilo derecho por detrás de los guía y sácalo por el bucle izquierdo.',
        paths: [{ d: 'M 160 60 C 130 95, 70 95, 40 90 C 30 90, 30 110, 40 110', rol: 'cordon' }],
      },
      {
        descripcion: 'Tira de ambas puntas para cerrar. Repite en espejo para completar el nudo plano.',
        paths: [{ d: 'M 40 110 C 70 130, 130 130, 160 110 M 160 110 C 165 130, 40 140, 40 155', rol: 'cordon' }],
      },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    slug: 'nudo-espiral',
    nombre: 'Nudo espiral',
    dificultad: 'principiante',
    orden: 3,
    descripcion:
      'Medio nudo plano repetido siempre en el mismo sentido: la pulsera gira sola formando una espiral.',
    videoUrl: undefined,
    svgSteps: [
      {
        descripcion: 'Igual que el nudo plano: dos guía al centro, un hilo de trabajo a cada lado.',
        paths: [
          { d: 'M 90 20 L 90 180 M 110 20 L 110 180', rol: 'guia' },
          { d: 'M 40 30 L 40 60 M 160 30 L 160 60', rol: 'cordon' },
        ],
      },
      {
        descripcion: 'Haz solo la primera mitad del nudo plano (izquierda sobre el centro).',
        paths: [{ d: 'M 40 60 C 70 60, 130 70, 160 65 C 130 95, 70 95, 40 95', rol: 'cordon' }],
      },
      {
        descripcion: 'Repite SIEMPRE esa misma mitad. Tras 4-5 repeticiones empezará a girar.',
        paths: [{ d: 'M 60 110 C 110 120, 150 135, 120 150 C 90 165, 60 150, 90 170', rol: 'cordon' }],
      },
    ],
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    slug: 'nudo-feston',
    nombre: 'Nudo festón',
    dificultad: 'intermedio',
    orden: 4,
    descripcion:
      'Doble medio nudo alrededor de un hilo guía. Permite dibujar líneas diagonales, curvas y letras.',
    videoUrl: undefined,
    svgSteps: [
      {
        descripcion: 'Tensa un hilo guía en diagonal. El hilo de trabajo llega por la izquierda.',
        paths: [
          { d: 'M 30 40 L 175 150', rol: 'guia' },
          { d: 'M 30 90 L 55 100', rol: 'cordon' },
        ],
      },
      {
        descripcion: 'Da la primera vuelta del hilo de trabajo alrededor del guía.',
        paths: [{ d: 'M 55 100 C 80 80, 80 120, 60 110', rol: 'cordon' }],
      },
      {
        descripcion: 'Da una segunda vuelta al lado de la primera: eso es un nudo festón completo.',
        paths: [{ d: 'M 60 110 C 90 95, 92 130, 72 122', rol: 'cordon' }],
      },
      {
        descripcion: 'Repite a lo largo del guía para trazar la línea diagonal.',
        paths: [{ d: 'M 72 122 C 100 112, 120 128, 130 138 M 130 138 C 150 130, 150 150, 140 148', rol: 'cordon' }],
      },
    ],
  },
]

export function getKnot(slug: string): Knot | undefined {
  return KNOTS.find((k) => k.slug === slug)
}
