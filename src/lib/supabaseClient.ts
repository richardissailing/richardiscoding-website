import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const isBrowser = typeof window !== 'undefined'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'sb-auth-token',
    storage: isBrowser ? {
      async getItem(key: string) {
        return localStorage.getItem(key)
      },
      async setItem(key: string, value: string) {
        localStorage.setItem(key, value)
      },
      async removeItem(key: string) {
        localStorage.removeItem(key)
      },
    } : undefined,
  },
})

export default supabase