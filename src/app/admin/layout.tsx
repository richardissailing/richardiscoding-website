"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { User } from '@supabase/auth-helpers-nextjs'
import AdminWrapper from '@/components/AdminWrapper'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  // Show login page content if we're on the login page
  if (pathname === '/admin/login') return children

  return (
    <AdminWrapper onAuthStateChange={setUser}>
      <div className="flex min-h-screen">
        <div className="w-64 bg-background border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <div className="mt-2 text-sm text-muted-foreground">
              {user?.email}
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
                href="/admin/about"
                className={`block p-2 hover:bg-accent rounded transition-colors ${
                  pathname === '/admin/about' ? 'bg-accent' : ''
                }`}
              >
                About
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
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </AdminWrapper>
  )
}