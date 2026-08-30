import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getPatternBySlug } from '~/lib/patterns.repo'
import { PracticeMode } from '~/components/PracticeMode'

export const Route = createFileRoute('/patrones/$slug')({
  loader: async ({ params }) => {
    const pattern = await getPatternBySlug(params.slug)
    if (!pattern) throw notFound()
    return { pattern }
  },
  component: PatternDetail,
})

function PatternDetail() {
  const { pattern } = Route.useLoaderData()

  // Nudos usados (derivados de los pasos que referencian un nudo).
  const nudosUsados = Array.from(
    new Set(pattern.steps.map((s) => s.knotSlug).filter((s): s is string => Boolean(s))),
  )

  return (
    <article className="stack" style={{ gap: 'var(--space-5)' }}>
      <div>
        <Link to="/patrones" className="link-back">
          ← Patrones
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {pattern.nombre}
          </h1>
          <span className={`badge badge--${pattern.dificultad}`}>{pattern.dificultad}</span>
        </div>
        {pattern.descripcion && (
          <p className="page-lead" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
            {pattern.descripcion}
          </p>
        )}
      </div>

      {nudosUsados.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-3)' }}>Nudos que usa</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {nudosUsados.map((slug) => (
              <Link
                key={slug}
                to="/nudos/$slug"
                params={{ slug }}
                className="badge"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)' }}
              >
                {slug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-3)' }}>Modo práctica</h2>
        <PracticeMode patternSlug={pattern.slug} steps={pattern.steps} />
      </section>
    </article>
  )
}
