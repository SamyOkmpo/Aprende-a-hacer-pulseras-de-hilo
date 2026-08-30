import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// El cliente es opcional: si aún no hay credenciales, la app funciona con los
// datos semilla locales (src/data). Esto permite desarrollar el POC sin DB.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
