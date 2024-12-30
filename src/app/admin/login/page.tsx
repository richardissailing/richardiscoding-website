"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.session) {
        throw new Error('No session created')
      }

      // Check admin status
      const adminCheck = await fetch('/api/admin')
      if (!adminCheck.ok) {
        const errorData = await adminCheck.json()
        throw new Error(errorData.error || 'Admin check failed')
      }

      router.replace('/admin')
      router.refresh()

    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginForm />
}