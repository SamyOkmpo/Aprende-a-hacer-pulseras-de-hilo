import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getKnotBySlug } from '~/lib/knots.repo'
import { KnotDiagram } from '~/components/KnotDiagram'

export const Route = createFileRoute('/nudos/$slug')({
  loader: async ({ params }) => {
    const knot = await getKnotBySlug(params.slug)
    if (!knot) throw notFound()
    return { knot }
  },
  component: KnotDetail,
})

function KnotDetail() {
  const { knot } = Route.useLoaderData()

  return (
    <article className="stack" style={{ gap: 'var(--space-5)' }}>
      <div>
        <Link to="/nudos" className="link-back">
          ← Nudos
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            {knot.nombre}
          </h1>
          <span className={`badge badge--${knot.dificultad}`}>{knot.dificultad}</span>
        </div>
        {knot.descripcion && (
          <p className="page-lead" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
            {knot.descripcion}
          </p>
        )}
      </div>

      {/* POC: diagrama animado paso a paso */}
      <KnotDiagram nombre={knot.nombre} steps={knot.svgSteps} />

      {/* Video corto (embebido) — opcional */}
      {knot.videoUrl && (
        <section>
          <h2 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-3)' }}>Video</h2>
          <div
            style={{
              position: 'relative',
              aspectRatio: '9 / 16',
              maxWidth: '18rem',
              marginInline: 'auto',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--surface-alt)',
            }}
          >
            <iframe
              src={knot.videoUrl}
              title={`Video del ${knot.nombre}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </section>
      )}
    </article>
  )
}
