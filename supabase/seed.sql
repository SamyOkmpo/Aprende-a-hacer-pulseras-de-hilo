-- ============================================================================
-- Nudos — datos semilla
-- ----------------------------------------------------------------------------
-- Espejo de src/data/knots.ts y src/data/patterns.ts. Ejecutar DESPUÉS de
-- schema.sql. Idempotente: usa upsert por slug.
-- ============================================================================

-- Nudos -----------------------------------------------------------------------
insert into public.knots (id, slug, nombre, dificultad, descripcion, svg_steps, orden) values
(
  '00000000-0000-4000-8000-000000000001', 'nudo-de-alondra', 'Nudo de alondra', 'principiante',
  'El nudo para montar hilos sobre un cordón base. Es casi siempre el punto de partida de una pulsera.',
  '[
    {"descripcion":"Coloca el cordón base en horizontal. Sobre él montaremos el hilo de trabajo.","paths":[{"d":"M 20 60 L 180 60","rol":"guia"}]},
    {"descripcion":"Dobla el hilo de trabajo por la mitad y pásalo por detrás del cordón base.","paths":[{"d":"M 100 60 C 100 90, 80 90, 80 120 M 100 60 C 100 90, 120 90, 120 120","rol":"cordon"}]},
    {"descripcion":"Pasa las dos puntas por dentro del bucle y tira hacia abajo para ajustar.","paths":[{"d":"M 80 120 C 80 140, 96 140, 96 170 M 120 120 C 120 140, 104 140, 104 170","rol":"cordon"}]}
  ]'::jsonb,
  1
),
(
  '00000000-0000-4000-8000-000000000002', 'nudo-plano', 'Nudo plano', 'principiante',
  'El nudo cuadrado clásico del macramé. Con dos hilos de trabajo alrededor de dos hilos guía se forma una superficie plana y firme.',
  '[
    {"descripcion":"Dos hilos guía en el centro y un hilo de trabajo a cada lado.","paths":[{"d":"M 90 20 L 90 180 M 110 20 L 110 180","rol":"guia"},{"d":"M 40 30 L 40 60 M 160 30 L 160 60","rol":"cordon"}]},
    {"descripcion":"Pasa el hilo izquierdo por encima de los guía y por debajo del derecho.","paths":[{"d":"M 40 60 C 70 60, 130 70, 160 60","rol":"cordon"}]},
    {"descripcion":"Pasa el hilo derecho por detrás de los guía y sácalo por el bucle izquierdo.","paths":[{"d":"M 160 60 C 130 95, 70 95, 40 90 C 30 90, 30 110, 40 110","rol":"cordon"}]},
    {"descripcion":"Tira de ambas puntas para cerrar. Repite en espejo para completar el nudo plano.","paths":[{"d":"M 40 110 C 70 130, 130 130, 160 110 M 160 110 C 165 130, 40 140, 40 155","rol":"cordon"}]}
  ]'::jsonb,
  2
),
(
  '00000000-0000-4000-8000-000000000003', 'nudo-espiral', 'Nudo espiral', 'principiante',
  'Medio nudo plano repetido siempre en el mismo sentido: la pulsera gira sola formando una espiral.',
  '[
    {"descripcion":"Igual que el nudo plano: dos guía al centro, un hilo de trabajo a cada lado.","paths":[{"d":"M 90 20 L 90 180 M 110 20 L 110 180","rol":"guia"},{"d":"M 40 30 L 40 60 M 160 30 L 160 60","rol":"cordon"}]},
    {"descripcion":"Haz solo la primera mitad del nudo plano (izquierda sobre el centro).","paths":[{"d":"M 40 60 C 70 60, 130 70, 160 65 C 130 95, 70 95, 40 95","rol":"cordon"}]},
    {"descripcion":"Repite SIEMPRE esa misma mitad. Tras 4-5 repeticiones empezará a girar.","paths":[{"d":"M 60 110 C 110 120, 150 135, 120 150 C 90 165, 60 150, 90 170","rol":"cordon"}]}
  ]'::jsonb,
  3
),
(
  '00000000-0000-4000-8000-000000000004', 'nudo-feston', 'Nudo festón', 'intermedio',
  'Doble medio nudo alrededor de un hilo guía. Permite dibujar líneas diagonales, curvas y letras.',
  '[
    {"descripcion":"Tensa un hilo guía en diagonal. El hilo de trabajo llega por la izquierda.","paths":[{"d":"M 30 40 L 175 150","rol":"guia"},{"d":"M 30 90 L 55 100","rol":"cordon"}]},
    {"descripcion":"Da la primera vuelta del hilo de trabajo alrededor del guía.","paths":[{"d":"M 55 100 C 80 80, 80 120, 60 110","rol":"cordon"}]},
    {"descripcion":"Da una segunda vuelta al lado de la primera: eso es un nudo festón completo.","paths":[{"d":"M 60 110 C 90 95, 92 130, 72 122","rol":"cordon"}]},
    {"descripcion":"Repite a lo largo del guía para trazar la línea diagonal.","paths":[{"d":"M 72 122 C 100 112, 120 128, 130 138 M 130 138 C 150 130, 150 150, 140 148","rol":"cordon"}]}
  ]'::jsonb,
  4
)
on conflict (slug) do update set
  nombre = excluded.nombre,
  dificultad = excluded.dificultad,
  descripcion = excluded.descripcion,
  svg_steps = excluded.svg_steps,
  orden = excluded.orden;

-- Patrón ----------------------------------------------------------------------
insert into public.patterns (id, slug, nombre, dificultad, descripcion, knot_ids) values
(
  '10000000-0000-4000-8000-000000000001', 'pulsera-espiral-terracota', 'Pulsera espiral terracota', 'principiante',
  'Una pulsera de una sola técnica, perfecta para empezar: se monta, se hace espiral y se cierra. En una tarde la tienes lista.',
  array[
    '00000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-4000-8000-000000000003'::uuid,
    '00000000-0000-4000-8000-000000000002'::uuid
  ]
)
on conflict (slug) do update set
  nombre = excluded.nombre,
  dificultad = excluded.dificultad,
  descripcion = excluded.descripcion,
  knot_ids = excluded.knot_ids;

-- Pasos del patrón ------------------------------------------------------------
delete from public.pattern_steps where pattern_id = '10000000-0000-4000-8000-000000000001';
insert into public.pattern_steps (pattern_id, orden, descripcion, repeticiones, knot_id) values
('10000000-0000-4000-8000-000000000001', 1, 'Corta 2 hilos guía de 40 cm y 2 hilos de trabajo de 90 cm.', 1, null),
('10000000-0000-4000-8000-000000000001', 2, 'Monta los hilos de trabajo sobre los guía con un nudo de alondra.', 1, '00000000-0000-4000-8000-000000000001'),
('10000000-0000-4000-8000-000000000001', 3, 'Haz un nudo plano completo para fijar el arranque.', 1, '00000000-0000-4000-8000-000000000002'),
('10000000-0000-4000-8000-000000000001', 4, 'Haz medios nudos en el mismo sentido hasta lograr la espiral. Cuenta cada medio nudo.', 30, '00000000-0000-4000-8000-000000000003'),
('10000000-0000-4000-8000-000000000001', 5, 'Cierra con un nudo plano y remata las puntas con un nudo corredizo.', 1, '00000000-0000-4000-8000-000000000002');
