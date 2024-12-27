import supabase from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    console.error('No code provided in callback')
    return NextResponse.redirect(`${origin}/admin/login?error=No code provided in callback`)
  }

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(error.message)}`
      )
    }

    // Get the next path from the session data
    const next = data.session?.user?.user_metadata?.next || '/admin'

    // Successful authentication, redirect to the intended page
    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('Error in auth callback:', error)
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent('Authentication failed')}`
    )
  }
}