// ============================================================================
// Repositorio de nudos: usa Supabase si está configurado; si no, cae a la
// semilla local. Devuelve siempre el tipo `Knot` de la app.
// ============================================================================

import { supabase, isSupabaseConfigured } from './supabase'
import { KNOTS, getKnot as getSeedKnot, type Knot } from '~/data/knots'

type KnotRow = {
  id: string
  slug: string
  nombre: string
  dificultad: Knot['dificultad']
  descripcion: string | null
  svg_steps: Knot['svgSteps'] | null
  video_url: string | null
  orden: number
}

function rowToKnot(row: KnotRow): Knot {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    dificultad: row.dificultad,
    descripcion: row.descripcion ?? '',
    svgSteps: row.svg_steps ?? [],
    videoUrl: row.video_url ?? undefined,
    orden: row.orden,
  }
}

export async function listKnots(): Promise<Knot[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('knots')
      .select('id, slug, nombre, dificultad, descripcion, svg_steps, video_url, orden')
      .order('orden', { ascending: true })
    if (!error && data) return (data as KnotRow[]).map(rowToKnot)
  }
  return [...KNOTS].sort((a, b) => a.orden - b.orden)
}

export async function getKnotBySlug(slug: string): Promise<Knot | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('knots')
      .select('id, slug, nombre, dificultad, descripcion, svg_steps, video_url, orden')
      .eq('slug', slug)
      .maybeSingle()
    if (!error && data) return rowToKnot(data as KnotRow)
  }
  return getSeedKnot(slug) ?? null
}
