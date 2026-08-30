import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { listPatterns } from '~/lib/patterns.repo'
import type { Dificultad } from '~/data/knots'

export const Route = createFileRoute('/patrones/')({
  loader: async () => ({ patterns: await listPatterns() }),
  component: PatternsList,
})

const FILTROS: Array<{ value: Dificultad | 'todas'; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
]

function PatternsList() {
  const { patterns } = Route.useLoaderData()
  const [filtro, setFiltro] = useState<Dificultad | 'todas'>('todas')

  const visibles = filtro === 'todas' ? patterns : patterns.filter((p) => p.dificultad === filtro)

  return (
    <section>
      <p className="eyebrow">Catálogo</p>
      <h1 className="page-title">Patrones</h1>
      <p className="page-lead">Elige una pulsera y sigue el modo práctica paso a paso.</p>

      <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', marginBottom: 'var(--space-5)' }}>
        {FILTROS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFiltro(f.value)}
            className="badge"
            style={
              filtro === f.value
                ? { background: 'var(--accent)', color: 'var(--on-accent)', cursor: 'pointer', border: 'none' }
                : { cursor: 'pointer', border: 'none' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stack" style={{ gap: 'var(--space-4)' }}>
        {visibles.map((p) => (
          <Link key={p.slug} to="/patrones/$slug" params={{ slug: p.slug }} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
              <h2 style={{ fontSize: '1.125rem' }}>{p.nombre}</h2>
              <span className={`badge badge--${p.dificultad}`}>{p.dificultad}</span>
            </div>
            {p.descripcion && (
              <p style={{ color: 'var(--muted)', margin: 'var(--space-2) 0 0', fontSize: '0.9375rem' }}>
                {p.descripcion}
              </p>
            )}
          </Link>
        ))}
        {visibles.length === 0 && <p className="page-lead">No hay patrones con esa dificultad todavía.</p>}
      </div>
    </section>
  )
}
