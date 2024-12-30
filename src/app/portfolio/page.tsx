"use client"

import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MotionDiv } from "@/components/motion"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { ExternalLink, Github } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  link?: string
  githubUrl?: string
  image?: string
}

function PortfolioContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects((data as unknown as Project[]) || [])
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
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
        >
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            My Portfolio
          </h1>
          <p className="text-lg text-muted-foreground mb-12 text-center">
            Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
          </p>
        </MotionDiv>
        
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No projects found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <MotionDiv
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {project.image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      {project.link && (
                        <Button asChild variant="default" className="flex-1">
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2" />
                            View Project
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={project.githubUrl} target="_blank">
                            <Github size={16} className="mr-2" />
                            Source
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <PortfolioContent />
    </Suspense>
  )
}