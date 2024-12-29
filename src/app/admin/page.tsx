// app/admin/page.tsx
"use client"

import AdminWrapper from '@/components/AdminWrapper'
import { useEffect, useState } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MotionDiv } from "@/components/motion"

interface DashboardStats {
  totalPosts: number
  pendingComments: number
  totalMessages: number
  totalPortfolioItems: number
}


// Create the inner dashboard component
function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    pendingComments: 0,
    totalMessages: 0,
    totalPortfolioItems: 0
  })
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadStats() {
      try {
        // Get total posts
        const { count: postsCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })

        // Get pending comments
        const { count: pendingCommentsCount } = await supabase
          .from('blog_comments')
          .select('*', { count: 'exact', head: true })
          .eq('approved', false)

        // Get total messages
        const { count: messagesCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })

        // Get total portfolio items
        const { count: portfolioCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })

        setStats({
          totalPosts: postsCount || 0,
          pendingComments: pendingCommentsCount || 0,
          totalMessages: messagesCount || 0,
          totalPortfolioItems: portfolioCount || 0
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/admin/blog">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalPosts}</p>
              </CardContent>
            </Card>
          </Link>
        </MotionDiv>

        {/* Rest of your MotionDiv components... */}
      </div>
    </div>
  )
}

// Export the wrapped version
export default function AdminDashboard() {
  return (
    <AdminWrapper>
      <DashboardContent />
    </AdminWrapper>
  )
}