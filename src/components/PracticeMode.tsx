import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { PatternStep } from '~/data/patterns'
import './PracticeMode.css'

type Props = {
  patternSlug: string
  steps: PatternStep[]
}

type Progress = {
  done: number[] // órdenes de pasos completados
  reps: Record<number, number> // contador por paso (orden -> repeticiones hechas)
}

const empty: Progress = { done: [], reps: {} }

function storageKey(slug: string) {
  return `nudos:progress:${slug}`
}

function loadProgress(slug: string): Progress {
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.localStorage.getItem(storageKey(slug))
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Progress
    return { done: parsed.done ?? [], reps: parsed.reps ?? {} }
  } catch {
    return empty
  }
}

/**
 * Modo práctica: checklist de pasos + contador de repeticiones.
 * El progreso se guarda en localStorage (por ahora); más adelante se puede
 * sincronizar con la tabla user_progress de Supabase.
 */
export function PracticeMode({ patternSlug, steps }: Props) {
  const [progress, setProgress] = useState<Progress>(empty)

  // Cargar tras montar para no romper el SSR (localStorage es client-only).
  useEffect(() => {
    setProgress(loadProgress(patternSlug))
  }, [patternSlug])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey(patternSlug), JSON.stringify(progress))
    } catch {
      /* almacenamiento no disponible: seguimos en memoria */
    }
  }, [patternSlug, progress])

  const toggleDone = (orden: number) =>
    setProgress((p) => ({
      ...p,
      done: p.done.includes(orden) ? p.done.filter((o) => o !== orden) : [...p.done, orden],
    }))

  const setReps = (orden: number, value: number) =>
    setProgress((p) => ({ ...p, reps: { ...p.reps, [orden]: Math.max(0, value) } }))

  const reset = () => setProgress(empty)

  const completados = progress.done.length
  const totalPasos = steps.length
  const pct = totalPasos ? Math.round((completados / totalPasos) * 100) : 0

  return (
    <div className="practice">
      <div className="practice__header">
        <div>
          <span className="practice__count">
            {completados} / {totalPasos} pasos
          </span>
          <div className="practice__bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
        <button type="button" className="practice__reset" onClick={reset}>
          Reiniciar
        </button>
      </div>

      <ol className="practice__list">
        {steps.map((step) => {
          const isDone = progress.done.includes(step.orden)
          const conContador = step.repeticiones > 1
          const hechas = progress.reps[step.orden] ?? 0
          return (
            <li key={step.orden} className={`practice__step ${isDone ? 'is-done' : ''}`}>
              <label className="practice__check">
                <input type="checkbox" checked={isDone} onChange={() => toggleDone(step.orden)} />
                <span className="practice__checkbox" aria-hidden="true" />
                <span className="practice__text">
                  {step.descripcion}
                  {step.knotSlug && (
                    <>
                      {' '}
                      <Link to="/nudos/$slug" params={{ slug: step.knotSlug }} className="practice__knot-link">
                        ver nudo →
                      </Link>
                    </>
                  )}
                </span>
              </label>

              {conContador && (
                <div className="counter" aria-label={`Contador de repeticiones, meta ${step.repeticiones}`}>
                  <button type="button" className="counter__btn" onClick={() => setReps(step.orden, hechas - 1)}>
                    −
                  </button>
                  <span className="counter__value">
                    {hechas}
                    <span className="counter__goal"> / {step.repeticiones}</span>
                  </span>
                  <button type="button" className="counter__btn" onClick={() => setReps(step.orden, hechas + 1)}>
                    +
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
