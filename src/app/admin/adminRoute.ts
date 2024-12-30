
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from 'src/lib/supabase/database.types.ts'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    // Get session and log it
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Session check:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      error: sessionError
    })
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    if (!session?.user?.email) {
      console.error('No session or email found')
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Query allowed_admins and log results
    const { data: adminData, error: adminError } = await supabase
      .from('allowed_admins')
      .select('*')
      .eq('email', session.user.email)
      .single()

    console.log('Admin check:', {
      email: session.user.email,
      found: !!adminData,
      adminData,
      error: adminError
    })

    if (adminError) {
      console.error('Admin query error:', adminError)
      return NextResponse.json({ 
        error: 'Failed to verify admin status',
        details: adminError.message 
      }, { status: 500 })
    }

    if (!adminData) {
      return NextResponse.json({ 
        error: 'Not authorized - Email not found in allowed_admins',
        email: session.user.email 
      }, { status: 403 })
    }

    return NextResponse.json({
      message: "Authorized",
      user: session.user
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}