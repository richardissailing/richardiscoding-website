"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface BlogPost {
  title: string
}

interface Comment {
  id: number
  post_id: number
  author_name: string
  author_email: string
  content: string
  approved: boolean
  created_at: string
  blog_posts: BlogPost
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadComments()
  }, [])

  async function loadComments() {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          id,
          post_id,
          author_name,
          author_email,
          content,
          approved,
          created_at,
          blog_posts (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .returns<Comment[]>()

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprovalToggle(comment: Comment) {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: !comment.approved })
        .eq('id', comment.id)
        .select()
        .returns<Comment>()

      if (error) throw error
      await loadComments()
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Comments</h1>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Comment on: {comment.blog_posts?.title || 'Unknown Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium">{comment.author_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {comment.author_email}
                  </div>
                </div>
                <p className="text-muted-foreground">{comment.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={comment.approved}
                      onCheckedChange={() => handleApprovalToggle(comment)}
                    />
                    <span>Approved</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && (
          <div className="text-center text-muted-foreground">
            No comments yet.
          </div>
        )}
      </div>
    </div>
  )
}