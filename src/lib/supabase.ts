import { createClient } from '@supabase/supabase-js'

const url     = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key     = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const svcKey  = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string | undefined

export const isSupabaseConfigured =
  Boolean(url && key && url.startsWith('https://') && !url.includes('placeholder'))

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder-key',
)

/**
 * Cliente com service role — apenas para o painel admin (muda passwords, etc.)
 * A chave fica no .env.local e nunca vai para o git.
 */
export const supabaseAdmin = svcKey
  ? createClient(url ?? 'https://placeholder.supabase.co', svcKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null
