"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
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
      console.log('Starting login process...')
      
      // Email check
      const emailCheck = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      
      const emailCheckData = await emailCheck.json()
      console.log('Email check response:', emailCheckData)

      if (!emailCheck.ok) {
        console.error('Email check failed:', emailCheckData)
        setError(emailCheckData.error || 'Email not authorized')
        return
      }

      // Login
      console.log('Attempting Supabase login...')
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        setError(signInError.message)
        return
      }

      if (data?.user) {
        console.log('Login successful:', data.user)
        
        // Get session
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session check:', session)

        if (session) {
          // Admin check
          console.log('Checking admin status...')
          const adminCheck = await fetch('/api/admin')
          const adminCheckData = await adminCheck.json()
          console.log('Admin check response:', adminCheckData)

          if (!adminCheck.ok) {
            console.error('Admin check failed:', adminCheckData)
            setError('Not authorized as admin')
            return
          }

          router.replace('/admin')
        } else {
          setError('Session could not be established')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com" 
            required 
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </div>
    </form>
  )
}