import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'


let clientSupabase: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createBrowserSupabaseClient = () => {
  if (clientSupabase) return clientSupabase
  
  clientSupabase = createClientComponentClient<Database>()
  return clientSupabase
}