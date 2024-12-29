import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(error.message)}`
      )
    }

    // Verify admin status after successful authentication
    const { data: adminCheck } = await supabase
      .from('allowed_admins')
      .select('*')
      .eq('email', data.session?.user?.email)
      .single()

    if (!adminCheck) {
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent('Not authorized as admin')}`
      )
    }

    return NextResponse.redirect(`${origin}/admin`)
  } catch (error) {
    console.error('Error in auth callback:', error)
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent('Authentication failed')}`
    )
  }
}