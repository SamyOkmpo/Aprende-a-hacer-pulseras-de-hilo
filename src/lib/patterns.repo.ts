// ============================================================================
// Repositorio de patrones: Supabase si está configurado; si no, semilla local.
// ============================================================================

import { supabase, isSupabaseConfigured } from './supabase'
import { PATTERNS, getPattern as getSeedPattern, type Pattern, type PatternStep } from '~/data/patterns'

type PatternRow = {
  id: string
  slug: string
  nombre: string
  dificultad: Pattern['dificultad']
  descripcion: string | null
  imagen_portada: string | null
  knot_ids: string[]
}

type StepRow = {
  orden: number
  descripcion: string
  repeticiones: number
  knot_id: string | null
}

export async function listPatterns(): Promise<Pattern[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('patterns')
      .select('id, slug, nombre, dificultad, descripcion, imagen_portada, knot_ids')
      .order('nombre', { ascending: true })
    if (!error && data) {
      return (data as PatternRow[]).map((r) => ({
        id: r.id,
        slug: r.slug,
        nombre: r.nombre,
        dificultad: r.dificultad,
        descripcion: r.descripcion ?? '',
        imagenPortada: r.imagen_portada ?? undefined,
        knotSlugs: [], // los slugs se resuelven en el detalle si hace falta
        steps: [],
      }))
    }
  }
  return PATTERNS
}

export async function getPatternBySlug(slug: string): Promise<Pattern | null> {
  if (isSupabaseConfigured && supabase) {
    const { data: p, error } = await supabase
      .from('patterns')
      .select('id, slug, nombre, dificultad, descripcion, imagen_portada, knot_ids')
      .eq('slug', slug)
      .maybeSingle()
    if (!error && p) {
      const row = p as PatternRow
      const { data: steps } = await supabase
        .from('pattern_steps')
        .select('orden, descripcion, repeticiones, knot_id')
        .eq('pattern_id', row.id)
        .order('orden', { ascending: true })

      // Resolver slugs de nudos referenciados por los pasos.
      const knotIds = (steps as StepRow[] | null)?.map((s) => s.knot_id).filter(Boolean) as string[]
      const slugById = new Map<string, string>()
      if (knotIds && knotIds.length) {
        const { data: knots } = await supabase.from('knots').select('id, slug').in('id', knotIds)
        for (const k of (knots ?? []) as { id: string; slug: string }[]) slugById.set(k.id, k.slug)
      }

      const mappedSteps: PatternStep[] = (steps as StepRow[] | null ?? []).map((s) => ({
        orden: s.orden,
        descripcion: s.descripcion,
        repeticiones: s.repeticiones,
        knotSlug: s.knot_id ? slugById.get(s.knot_id) : undefined,
      }))

      return {
        id: row.id,
        slug: row.slug,
        nombre: row.nombre,
        dificultad: row.dificultad,
        descripcion: row.descripcion ?? '',
        imagenPortada: row.imagen_portada ?? undefined,
        knotSlugs: [],
        steps: mappedSteps,
      }
    }
  }
  return getSeedPattern(slug) ?? null
}
