"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { User } from '@supabase/auth-helpers-nextjs'

interface AdminWrapperProps {
  children: React.ReactNode
  onAuthStateChange?: (user: User | null) => void
}

export default function AdminWrapper({ children, onAuthStateChange }: AdminWrapperProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          if (mounted) {
            setIsLoading(false)
            router.replace('/admin/login')
          }
          return
        }

        const adminCheck = await fetch('/api/admin')
        const adminData = await adminCheck.json()

        if (!adminCheck.ok) {
          if (mounted) {
            setIsLoading(false)
            router.replace('/admin/login')
          }
          return
        }

        if (mounted) {
          setIsAuthorized(true)
          setIsLoading(false)
          if (onAuthStateChange) {
            onAuthStateChange(session.user)
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (mounted) {
          setIsLoading(false)
          router.replace('/admin/login')
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router, supabase, onAuthStateChange])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
}