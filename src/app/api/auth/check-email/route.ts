import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    console.log('Checking email:', email)

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('allowed_users')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single()

    console.log('Query result:', { data, error })

    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.error('allowed_users table not found')
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 401 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Email not authorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      message: 'Email authorized',
      user: { email: data.email }
    })

  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}