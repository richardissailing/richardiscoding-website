"use client"
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { MotionDiv } from "@/components/motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ShareButtons } from "@/components/share-buttons"

interface BlogPost {
  id: number
  title: string
  content: string
  published_at: string
  featured_image?: string
}

interface Comment {
  id: number
  author_name: string
  content: string
  created_at: string
}

export default function BlogPost() {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState({
    author_name: '',
    author_email: '',
    content: ''
  })
  
  const params = useParams() as { slug: string }
  const supabase = createBrowserSupabaseClient()
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    if (params.slug) {
      loadPostAndComments()
    }
  }, [params.slug])

  async function loadPostAndComments() {
    try {
      // Load post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .single() as { data: BlogPost | null, error: Error | null }

      if (postError) throw postError
      if (!postData) {
        setPost(null)
        return
      }
      setPost(postData)

      // Load comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('id, author_name, content, created_at')
        .eq('post_id', postData.id)
        .eq('approved', true)
        .order('created_at', { ascending: true }) as { data: Comment[] | null, error: Error | null }

      if (commentsError) throw commentsError
      setComments(commentsData || [])
    } catch (error) {
      console.error('Error loading content:', error)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (!post?.id) throw new Error('Post ID is required')

      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: post.id,
          ...newComment,
          approved: false
        })

      if (error) throw error

      toast({
        title: "Comment submitted",
        description: "Your comment will be visible after approval.",
      })

      setNewComment({
        author_name: '',
        author_email: '',
        content: ''
      })
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return <div className="text-center py-16">Post not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="text-muted-foreground mb-8">
            {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">Share this post:</p>
            <ShareButtons 
              title={post.title} 
              url={shareUrl} 
            />
          </div>

          <Card className="p-8 mb-8">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            
            <Card className="p-6 mb-8">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={newComment.author_name}
                      onChange={(e) => setNewComment({
                        ...newComment,
                        author_name: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={newComment.author_email}
                      onChange={(e) => setNewComment({
                        ...newComment,
                        author_email: e.target.value
                      })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <Textarea
                    value={newComment.content}
                    onChange={(e) => setNewComment({
                      ...newComment,
                      content: e.target.value
                    })}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Comment"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="font-medium">{comment.author_name}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                  <p>{comment.content}</p>
                </Card>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}