"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  link?: string
  image?: string
  created_at?: string
}

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Project[]>()

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleProjectUpdate(project: Project) {
    setSaving(true)
    try {
      // Convert Project object to a plain object for Supabase
      const projectData: Record<string, unknown> = {
        id: project.id,
        title: project.title,
        description: project.description,
        tags: project.tags,
        link: project.link || null,
        image: project.image || null,
        created_at: project.created_at
      }

      const { error } = await supabase
        .from('projects')
        .upsert(projectData)
        .select()
        .returns<Project>()
      
      if (error) throw error
      await loadProjects()
    } catch (error) {
      console.error('Error updating project:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleProjectDelete(id: number) {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .match({ id })
      
      if (error) throw error
      await loadProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  function handleAddNew() {
    const newProject: Project = {
      id: Date.now(), // Temporary ID for new items
      title: '',
      description: '',
      tags: [],
      link: '',
      image: '',
      created_at: new Date().toISOString()
    }
    setProjects([...projects, newProject])
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `project-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath)

      const updated = [...projects]
      updated[index].image = publicUrl
      setProjects(updated)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Portfolio</h1>
        <Button onClick={handleAddNew}>Add New Project</Button>
      </div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <Card key={project.id} className="bg-card">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={project.title}
                  onChange={(e) => {
                    const updated = [...projects]
                    updated[index].title = e.target.value
                    setProjects(updated)
                  }}
                  placeholder="Project Title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={project.description}
                  onChange={(e) => {
                    const updated = [...projects]
                    updated[index].description = e.target.value
                    setProjects(updated)
                  }}
                  placeholder="Project Description"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input
                  value={project.tags.join(', ')}
                  onChange={(e) => {
                    const updated = [...projects]
                    updated[index].tags = e.target.value.split(',').map(tag => tag.trim())
                    setProjects(updated)
                  }}
                  placeholder="React, TypeScript, Tailwind"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Link</label>
                <Input
                  value={project.link || ''}
                  onChange={(e) => {
                    const updated = [...projects]
                    updated[index].link = e.target.value
                    setProjects(updated)
                  }}
                  placeholder="https://github.com/yourusername/project"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, index)}
                />
                {project.image && (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleProjectDelete(project.id)}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleProjectUpdate(project)}
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