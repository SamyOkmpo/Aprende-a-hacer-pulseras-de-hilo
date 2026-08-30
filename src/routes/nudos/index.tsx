import { createFileRoute, Link } from '@tanstack/react-router'
import { listKnots } from '~/lib/knots.repo'

export const Route = createFileRoute('/nudos/')({
  loader: async () => ({ knots: await listKnots() }),
  component: KnotsLibrary,
})

function KnotsLibrary() {
  const { knots } = Route.useLoaderData()

  return (
    <section>
      <p className="eyebrow">Biblioteca</p>
      <h1 className="page-title">Nudos base</h1>
      <p className="page-lead">
        Domina estos nudos y podrás tejer casi cualquier pulsera. Toca uno para ver el diagrama animado.
      </p>

      <div className="grid">
        {knots.map((knot) => (
          <Link key={knot.slug} to="/nudos/$slug" params={{ slug: knot.slug }} className="card">
            <span className={`badge badge--${knot.dificultad}`}>{knot.dificultad}</span>
            <h2 style={{ fontSize: '1.0625rem', marginTop: 'var(--space-3)' }}>{knot.nombre}</h2>
          </Link>
        ))}
      </div>
    </section>
  )
}
