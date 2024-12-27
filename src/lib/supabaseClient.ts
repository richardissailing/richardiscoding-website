import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

let clientSupabase: ReturnType<typeof createClient> | null = null

export const createBrowserSupabaseClient = () => {
  if (clientSupabase) return clientSupabase

  const isBrowser = typeof window !== 'undefined'
  
  clientSupabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
      storage: isBrowser ? {
        getItem: (key: string) => window.localStorage.getItem(key),
        setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
        removeItem: (key: string) => window.localStorage.removeItem(key)
      } : undefined
    }
  })
  
  return clientSupabase
}

// Create and export a default instance
const supabase = createBrowserSupabaseClient()
export default supabase