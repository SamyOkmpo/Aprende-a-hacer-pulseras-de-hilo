import { createFileRoute, Link } from '@tanstack/react-router'
import { listPatterns } from '~/lib/patterns.repo'
import { listKnots } from '~/lib/knots.repo'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [patterns, knots] = await Promise.all([listPatterns(), listKnots()])
    return {
      destacadas: patterns.slice(0, 3),
      knotsCount: knots.length,
    }
  },
  component: Home,
})

function Home() {
  const { destacadas, knotsCount } = Route.useLoaderData()

  return (
    <div className="stack" style={{ gap: 'var(--space-6)' }}>
      <header>
        <p className="eyebrow">Hola de nuevo</p>
        <h1 className="page-title" style={{ fontSize: '2rem' }}>
          ¿Qué tejemos hoy?
        </h1>
      </header>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ fontSize: '1.125rem' }}>Pulseras destacadas</h2>
          <Link to="/patrones" style={{ color: 'var(--accent)', fontSize: '0.9375rem', fontWeight: 600 }}>
            Ver todas
          </Link>
        </div>

        <div className="stack" style={{ gap: 'var(--space-4)' }}>
          {destacadas.map((p) => (
            <Link key={p.slug} to="/patrones/$slug" params={{ slug: p.slug }} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)' }}>
                <h3 style={{ fontSize: '1.0625rem' }}>{p.nombre}</h3>
                <span className={`badge badge--${p.dificultad}`}>{p.dificultad}</span>
              </div>
              {p.descripcion && (
                <p style={{ color: 'var(--muted)', margin: 'var(--space-2) 0 0', fontSize: '0.9375rem' }}>
                  {p.descripcion}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Link
          to="/nudos"
          className="card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}
        >
          <div>
            <h2 style={{ fontSize: '1.0625rem' }}>Biblioteca de nudos</h2>
            <p style={{ color: 'var(--muted)', margin: 'var(--space-1) 0 0', fontSize: '0.9375rem' }}>
              {knotsCount} nudos base con diagrama animado
            </p>
          </div>
          <span aria-hidden="true" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>
            →
          </span>
        </Link>
      </section>
    </div>
  )
}
