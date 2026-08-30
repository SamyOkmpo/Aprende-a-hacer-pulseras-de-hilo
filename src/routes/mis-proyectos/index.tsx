import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/mis-proyectos/')({
  component: MyProjects,
})

function MyProjects() {
  // Placeholder de la galería personal. La lectura/escritura real usará la
  // tabla user_projects (con RLS) cuando la auth esté conectada.
  return (
    <section>
      <p className="eyebrow">Galería</p>
      <h1 className="page-title">Mis proyectos</h1>
      <p className="page-lead">Guarda tus pulseras con foto, color de hilo y notas.</p>

      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-5)' }}>
        <p style={{ fontSize: '2.5rem', margin: 0 }} aria-hidden="true">
          ❑
        </p>
        <p style={{ color: 'var(--muted)', margin: 'var(--space-3) 0 var(--space-5)' }}>
          Aún no has guardado ningún proyecto.
        </p>
        <Link to="/patrones" className="btn btn--primary">
          Empezar una pulsera
        </Link>
      </div>
    </section>
  )
}
