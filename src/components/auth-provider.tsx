"use client"

import { createContext, useContext, useEffect, useState } from "react"
import supabase from '@/lib/supabaseClient'
import { User, SupabaseClient } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: any | null
  loading: boolean
  supabase: SupabaseClient
  signIn?: (email: string, password: string) => Promise<void>
  signOut?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  supabase: supabase
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

import { ReactNode } from "react"

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    console.log('AuthProvider component mounted')
  }, [])

  const signOut = async () => {
    try {
      console.log('Attempting to sign out')
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      console.log('Sign out successful')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with email:', email)
      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Error signing in:', error.message)
        return
      }
      setUser(user)
      console.log('Sign in successful, user:', user)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error during sign in:', error.message)
      } else {
        console.error('Error during sign in:', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, supabase, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider