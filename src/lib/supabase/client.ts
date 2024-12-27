import { createClient } from '@supabase/supabase-js'

let clientSupabase: ReturnType<typeof createClient> | null = null

export const createBrowserSupabaseClient = () => {
  if (clientSupabase) return clientSupabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const isBrowser = typeof window !== 'undefined'

  clientSupabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
      storage: isBrowser ? {
        getItem: (key: string) => {
          return window.localStorage.getItem(key)
        },
        setItem: (key: string, value: string) => {
          window.localStorage.setItem(key, value)
        },
        removeItem: (key: string) => {
          window.localStorage.removeItem(key)
        }
      } : undefined
    }
  })

  return clientSupabase
}