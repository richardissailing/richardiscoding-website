import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables missing on callback route')
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  console.log('Auth callback triggered', {
    hasCode: !!code,
    origin,
    url: request.url
  })

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(new URL('/admin/login?error=no_code', origin))
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Session exchange error:', error)
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, origin)
      )
    }

    if (!data.session) {
      console.error('No session data received')
      return NextResponse.redirect(
        new URL('/admin/login?error=no_session', origin)
      )
    }

    const next = data.session?.user?.user_metadata?.next || '/admin'
    const redirectUrl = new URL(next, origin)
    
    console.log('Successful auth, redirecting to:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Callback route error:', error)
    return NextResponse.redirect(
      new URL('/admin/login?error=callback_failed', origin)
    )
  }
}
