import { useEffect, useState } from 'react'
import type { KnotStep } from '~/data/knots'
import './KnotDiagram.css'

type Props = {
  nombre: string
  steps: KnotStep[]
}

/**
 * Diagrama de nudo que se "dibuja" paso a paso.
 *
 * Técnica: cada <path> lleva pathLength="1", así stroke-dasharray/offset viven
 * en el rango [0,1] sin necesidad de medir la longitud real. Los pasos ya
 * vistos quedan dibujados (offset 0); el paso actual se anima de 1 → 0 vía CSS.
 * El `key` (índice + nonce) fuerza el re-montaje para reproducir la animación
 * al cambiar de paso o al repetir. Respeta prefers-reduced-motion (ver CSS).
 */
export function KnotDiagram({ nombre, steps }: Props) {
  const [current, setCurrent] = useState(0)
  const [replayNonce, setReplayNonce] = useState(0)

  // Si cambia el nudo (otra ruta) reseteamos al primer paso.
  useEffect(() => {
    setCurrent(0)
  }, [nombre])

  const total = steps.length
  const step = steps[current]
  if (total === 0 || !step) return null

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1))
  const goNext = () => setCurrent((c) => Math.min(total - 1, c + 1))
  const handleReplay = () => setReplayNonce((n) => n + 1)

  return (
    <figure className="knot-diagram">
      <div className="knot-diagram__canvas">
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Diagrama del ${nombre}, paso ${current + 1} de ${total}: ${step.descripcion}`}
        >
          {/* Pasos ya completados (contexto) */}
          {steps.slice(0, current).map((s, i) =>
            s.paths.map((p, j) => (
              <path
                key={`done-${i}-${j}`}
                d={p.d}
                pathLength={1}
                fill="none"
                className={`knot-path knot-path--done knot-path--${p.rol ?? 'cordon'}`}
              />
            )),
          )}

          {/* Paso actual (se anima). El key reinicia la animación al avanzar o repetir. */}
          {step.paths.map((p, j) => (
            <path
              key={`now-${current}-${replayNonce}-${j}`}
              d={p.d}
              pathLength={1}
              fill="none"
              className={`knot-path knot-path--now knot-path--${p.rol ?? 'cordon'}`}
              style={{ animationDelay: `${j * 0.35}s` }}
            />
          ))}
        </svg>
      </div>

      <figcaption className="knot-diagram__caption">
        <div className="knot-diagram__meta">
          <span className="knot-diagram__step-count">
            Paso {current + 1} de {total}
          </span>
          <button
            type="button"
            className="knot-diagram__replay"
            onClick={handleReplay}
            aria-label="Repetir animación del paso"
          >
            ↺ Repetir
          </button>
        </div>
        <p className="knot-diagram__desc">{step.descripcion}</p>
      </figcaption>

      <div className="knot-diagram__controls">
        <button type="button" onClick={goPrev} disabled={current === 0} className="knot-btn">
          ← Anterior
        </button>

        <div className="knot-diagram__dots" role="tablist" aria-label="Pasos">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Ir al paso ${i + 1}`}
              className={`knot-dot ${i === current ? 'is-active' : ''} ${i < current ? 'is-done' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={current === total - 1}
          className="knot-btn knot-btn--primary"
        >
          Siguiente →
        </button>
      </div>
    </figure>
  )
}
