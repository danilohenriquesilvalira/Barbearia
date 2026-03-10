import { createClient } from '@supabase/supabase-js'

// As credenciais lêem-se apenas das variáveis de ambiente (NUNCA hardcoded)
// O ficheiro .env.local está no .gitignore e nunca vai para o GitHub
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** true quando o projeto está configurado com Supabase */
export const isSupabaseConfigured =
  Boolean(url && key && url.startsWith('https://') && !url.includes('placeholder'))

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  key ?? 'placeholder-key',
)
