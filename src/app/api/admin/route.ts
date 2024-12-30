import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from 'src/lib/supabase/database.types.ts'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('Admin API route hit - starting check')
  
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore
    })

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Auth Session:', {
      hasSession: !!session,
      userEmail: session?.user?.email,
      sessionError
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }

    if (!session?.user?.email) {
      console.error('No session or email found')
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Try a direct query first to debug table access
    const { data: tableTest, error: tableError } = await supabase
      .from('allowed_admins')
      .select('*')
    
    console.log('Table test:', { data: tableTest, error: tableError })

    // Now check for the specific user
    const { data: adminData, error: adminError } = await supabase
      .from('allowed_admins')
      .select()
      .eq('email', session.user.email)
      .single()

    console.log('Admin check:', {
      email: session.user.email,
      data: adminData,
      error: adminError
    })

    if (adminError) {
      console.error('Admin check failed:', adminError)
      return NextResponse.json({ 
        error: 'Admin check failed', 
        details: adminError.message 
      }, { status: 403 })
    }

    if (!adminData) {
      return NextResponse.json({ 
        error: 'Not authorized',
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