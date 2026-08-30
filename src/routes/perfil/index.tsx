import { createFileRoute } from '@tanstack/react-router'
import { isSupabaseConfigured } from '~/lib/supabase'

export const Route = createFileRoute('/perfil/')({
  component: Profile,
})

function Profile() {
  return (
    <section>
      <p className="eyebrow">Cuenta</p>
      <h1 className="page-title">Perfil</h1>
      <p className="page-lead">Ajustes y sesión.</p>

      {!isSupabaseConfigured && (
        <div className="notice" style={{ marginBottom: 'var(--space-5)' }}>
          Supabase aún no está configurado. Copia <code>.env.example</code> a <code>.env</code> y añade tus
          credenciales para habilitar el inicio de sesión y el guardado de proyectos.
        </div>
      )}

      <div className="stack" style={{ gap: 'var(--space-3)' }}>
        <button type="button" className="btn btn--primary btn--block" disabled={!isSupabaseConfigured}>
          Iniciar sesión
        </button>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', textAlign: 'center' }}>
          El flujo de auth (magic link / OAuth con Supabase) se conecta en el siguiente paso.
        </p>
      </div>
    </section>
  )
}
