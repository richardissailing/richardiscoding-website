import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Check if email exists before comparing
    if (!session.user.email) {
      return NextResponse.json({ error: 'No email found in session' }, { status: 401 })
    }

    // You can add your admin email check here
    const allowedEmails = ['your-admin-email@example.com']
    if (!allowedEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json({
      user: session.user,
      message: 'Authenticated successfully'
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}