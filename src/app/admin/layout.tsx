"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [user, loading, pathname, router])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // Always show login page content if we're on the login page
  if (pathname === '/admin/login') {
    return children
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user) {
    return null
  }

  // Main layout for authenticated users
  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <div className="w-64 bg-background border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <div className="mt-2 text-sm text-muted-foreground">
            {user.email}
          </div>
          <nav className="mt-8 space-y-2">
            <Link
              href="/admin"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin' ? 'bg-accent' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/portfolio"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/portfolio' ? 'bg-accent' : ''
              }`}
            >
              Portfolio Items
            </Link>
            <Link
              href="/admin/certifications"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/certifications' ? 'bg-accent' : ''
              }`}
            >
              Certifications
            </Link>
            <Link
              href="/admin/messages"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/messages' ? 'bg-accent' : ''
              }`}
            >
              Messages
            </Link>
            <Link
              href="/admin/services"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/services' ? 'bg-accent' : ''
              }`}
            >
              Services
            </Link>
            <Link
              href="/admin/comments"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/comments' ? 'bg-accent' : ''
              }`}
            >
              Comments
            </Link>
            <Link
              href="/admin/blog"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/blog' ? 'bg-accent' : ''
              }`}
            >
              Blog Posts
            </Link>
            <Link
              href="/admin/settings"
              className={`block p-2 hover:bg-accent rounded transition-colors ${
                pathname === '/admin/settings' ? 'bg-accent' : ''
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}