import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(`${origin}/admin/login?error=No code provided in callback`)
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(error.message)}`
      )
    }

    const next = data.session?.user?.user_metadata?.next || '/admin'
    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('Error in auth callback:', error)
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent('Authentication failed')}`
    )
  }
}