import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get the session and check if it's valid
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Check if the user's email is in the allowed_admins table
    const { data: isAllowed, error: checkError } = await supabase
      .rpc('is_admin_email', { check_email: session.user.email })
      
    if (checkError) {
      console.error('Error checking admin status:', checkError)
      return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 })
    }
    
    if (!isAllowed) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json({
      user: session.user,
      message: 'Authenticated'
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}