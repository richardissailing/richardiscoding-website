import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

let clientSupabase: ReturnType<typeof createClientComponentClient> | null = null

export const createBrowserSupabaseClient = () => {
  if (clientSupabase) return clientSupabase

  clientSupabase = createClientComponentClient()
  return clientSupabase
}