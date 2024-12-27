"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  featured: boolean
  published_at: string | null
  featured_image?: string
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<BlogPost[]>()

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handlePostUpdate(post: BlogPost) {
    setSaving(true)
    try {
      // If there's no slug, generate one from the title
      if (!post.slug && post.title) {
        post.slug = generateSlug(post.title)
      }

      const postData: Record<string, unknown> = {
        ...post,
        published_at: post.published ? post.published_at || new Date().toISOString() : null
      }

      const { error } = await supabase
        .from('blog_posts')
        .upsert(postData)
        .select()
        .returns<BlogPost>()
      
      if (error) throw error
      await loadPosts()
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setSaving(false)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handlePostDelete(id: number) {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .match({ id })
      
      if (error) throw error
      await loadPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, post: BlogPost) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      await handlePostUpdate({ ...post, featured_image: publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  function handleAddNew() {
    const newPost: BlogPost = {
      id: Date.now(), // Temporary ID for new posts
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      published: false,
      featured: false,
      published_at: null
    }
    setPosts([newPost, ...posts])
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
        <h1 className="text-3xl font-bold">Manage Blog</h1>
        <Button onClick={handleAddNew}>Add New Post</Button>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={post.title}
                  onChange={(e) => {
                    const updated = [...posts]
                    const index = updated.findIndex(p => p.id === post.id)
                    const newTitle = e.target.value
                    updated[index] = { 
                      ...post, 
                      title: newTitle,
                      slug: generateSlug(newTitle)
                    }
                    setPosts(updated)
                  }}
                  placeholder="Post title"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={post.slug}
                  onChange={(e) => {
                    const updated = [...posts]
                    const index = updated.findIndex(p => p.id === post.id)
                    updated[index] = { ...post, slug: generateSlug(e.target.value) }
                    setPosts(updated)
                  }}
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={post.excerpt}
                  onChange={(e) => {
                    const updated = [...posts]
                    const index = updated.findIndex(p => p.id === post.id)
                    updated[index] = { ...post, excerpt: e.target.value }
                    setPosts(updated)
                  }}
                  placeholder="Brief description of the post"
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={post.content}
                  onChange={(e) => {
                    const updated = [...posts]
                    const index = updated.findIndex(p => p.id === post.id)
                    updated[index] = { ...post, content: e.target.value }
                    setPosts(updated)
                  }}
                  placeholder="Post content (Markdown supported)"
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, post)}
                />
                {post.featured_image && (
                  <div className="relative w-40 h-40">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handlePostUpdate({ ...post, featured_image: '' })}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={post.published}
                    onCheckedChange={(checked) => {
                      const updated = [...posts]
                      const index = updated.findIndex(p => p.id === post.id)
                      updated[index] = { ...post, published: checked }
                      setPosts(updated)
                    }}
                  />
                  <Label>Published</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={post.featured}
                    onCheckedChange={(checked) => {
                      const updated = [...posts]
                      const index = updated.findIndex(p => p.id === post.id)
                      updated[index] = { ...post, featured: checked }
                      setPosts(updated)
                    }}
                  />
                  <Label>Featured</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handlePostDelete(post.id)}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handlePostUpdate(post)}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}