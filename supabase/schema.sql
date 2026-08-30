-- ============================================================================
-- Nudos — esquema de base de datos (Supabase / PostgreSQL)
-- ============================================================================
-- Ejecutar en el SQL Editor de Supabase, o vía `supabase db push`.
-- Contenido de catálogo (knots, patterns, pattern_steps) = lectura pública.
-- Datos de usuario (user_projects, user_progress) = privados con RLS.
-- ============================================================================

-- Extensiones -----------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()

-- Enum de dificultad ----------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'dificultad') then
    create type dificultad as enum ('principiante', 'intermedio', 'avanzado');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- knots — biblioteca de nudos base
-- ----------------------------------------------------------------------------
create table if not exists public.knots (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nombre        text not null,
  dificultad    dificultad not null default 'principiante',
  descripcion   text,
  -- Diagrama: o bien una URL a un SVG, o pasos declarativos en JSON.
  -- svg_steps: [{ "descripcion": "...", "paths": [{ "d": "M..." }] }, ...]
  svg_diagram_url text,
  svg_steps     jsonb,
  video_url     text,
  orden         int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists knots_orden_idx on public.knots (orden);

-- ----------------------------------------------------------------------------
-- patterns — pulseras / patrones
-- ----------------------------------------------------------------------------
create table if not exists public.patterns (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  nombre         text not null,
  dificultad     dificultad not null default 'principiante',
  descripcion    text,
  imagen_portada text,
  -- Nudos usados (orden de referencia rápida). El detalle paso a paso vive
  -- en pattern_steps para poder asociar cada paso a un nudo concreto.
  knot_ids       uuid[] not null default '{}',
  created_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- pattern_steps — pasos de un patrón (modo práctica)
-- ----------------------------------------------------------------------------
create table if not exists public.pattern_steps (
  id          uuid primary key default gen_random_uuid(),
  pattern_id  uuid not null references public.patterns (id) on delete cascade,
  orden       int not null,
  descripcion text not null,
  -- Repeticiones sugeridas para el contador del modo práctica.
  repeticiones int not null default 1,
  knot_id     uuid references public.knots (id) on delete set null,
  unique (pattern_id, orden)
);

create index if not exists pattern_steps_pattern_idx on public.pattern_steps (pattern_id, orden);

-- ----------------------------------------------------------------------------
-- user_projects — galería personal
-- ----------------------------------------------------------------------------
create table if not exists public.user_projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  pattern_id  uuid references public.patterns (id) on delete set null,
  nombre      text not null,
  foto_url    text,
  notas       text,
  hilo_color  text,
  completado  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists user_projects_user_idx on public.user_projects (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- user_progress — progreso por patrón (continuar donde quedé)
-- ----------------------------------------------------------------------------
create table if not exists public.user_progress (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  pattern_id        uuid not null references public.patterns (id) on delete cascade,
  pasos_completados int[] not null default '{}',
  updated_at        timestamptz not null default now(),
  unique (user_id, pattern_id)
);

create index if not exists user_progress_user_idx on public.user_progress (user_id, updated_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Catálogo: lectura pública (anon + authenticated), sin escritura desde cliente.
alter table public.knots         enable row level security;
alter table public.patterns      enable row level security;
alter table public.pattern_steps enable row level security;

drop policy if exists "knots lectura publica" on public.knots;
create policy "knots lectura publica" on public.knots
  for select using (true);

drop policy if exists "patterns lectura publica" on public.patterns;
create policy "patterns lectura publica" on public.patterns
  for select using (true);

drop policy if exists "pattern_steps lectura publica" on public.pattern_steps;
create policy "pattern_steps lectura publica" on public.pattern_steps
  for select using (true);

-- Datos de usuario: cada quien ve y edita solo lo suyo.
alter table public.user_projects enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "projects son del dueno" on public.user_projects;
create policy "projects son del dueno" on public.user_projects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "progress es del dueno" on public.user_progress;
create policy "progress es del dueno" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Storage (opcional): bucket para fotos de proyectos de usuario
-- ============================================================================
-- Crea el bucket 'project-photos' (público en lectura) desde el panel de
-- Storage, o descomenta:
-- insert into storage.buckets (id, name, public) values ('project-photos', 'project-photos', true)
--   on conflict (id) do nothing;
