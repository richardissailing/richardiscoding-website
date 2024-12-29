import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('Middleware session check:', {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      userEmail: session?.user?.email
    })

    // Always allow access to login page and API routes
    if (req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname.startsWith('/api/')) {
      return res
    }

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/admin/login'
        return NextResponse.redirect(redirectUrl)
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*']
}