"use client"
import { Suspense, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionDiv } from "@/components/motion"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  featured: boolean
  published_at: string
  featured_image?: string
}

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false }) as { data: BlogPost[] | null, error: Error | null }

        if (error) throw error
        setPosts(data || [])
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, ideas, and insights about software development and technology.
          </p>
        </MotionDiv>

        <div className="grid gap-8">
          {posts.map((post, index) => (
            <MotionDiv
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  {post.featured_image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      {new Date(post.published_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            </MotionDiv>
          ))}
          {posts.length === 0 && (
            <div className="text-center text-muted-foreground">
              No blog posts published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  )
}