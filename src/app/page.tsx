"use client"

import { Suspense, useEffect, useState } from 'react'
import { Hero } from "@/components/hero"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { MotionDiv } from "@/components/motion"
import Link from 'next/link'
import { Code, Server, ExternalLink, Loader2, BrainCircuit } from 'lucide-react'

interface Service {
  id: number
  title: string
  description: string
  created_at?: string
  updated_at?: string
}

interface Project {
  id: number
  title: string
  description: string
  link?: string
  featured_image?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}

const icons = {
  'Cloud': Code,
  'Python': BrainCircuit,
  'Infrastructure': Server,
} as const

const getIconComponent = (title: string) => {
  const firstWord = title.split(' ')[0] as keyof typeof icons
  return icons[firstWord] || Code
}

function LoadingCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="animate-pulse h-8 w-8 bg-primary/20 rounded-full mb-4" />
        <div className="animate-pulse h-6 w-3/4 bg-primary/20 rounded" />
      </CardHeader>
      <CardContent>
        <div className="animate-pulse h-20 bg-primary/10 rounded" />
      </CardContent>
    </Card>
  )
}

function LoadingProject() {
  return (
    <Card className="h-full">
      <div className="animate-pulse h-48 bg-primary/20" />
      <CardHeader>
        <div className="animate-pulse h-6 w-3/4 bg-primary/20 rounded" />
      </CardHeader>
      <CardContent>
        <div className="animate-pulse h-16 bg-primary/10 rounded mb-4" />
        <div className="flex gap-2">
          <div className="animate-pulse h-6 w-16 bg-primary/20 rounded-full" />
          <div className="animate-pulse h-6 w-16 bg-primary/20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function HomeContent() {
  const [services, setServices] = useState<Service[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true)
        setError(null)

        const [servicesResponse, projectsResponse] = await Promise.all([
          supabase
            .from('services')
            .select('*')
            .order('id')
            .returns<Service[]>(),
          supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3)
            .returns<Project[]>()
        ])

        if (servicesResponse.error) throw servicesResponse.error
        if (projectsResponse.error) throw projectsResponse.error

        setServices(servicesResponse.data || [])
        setProjects(projectsResponse.data || [])
      } catch (error) {
        console.error('Error loading content:', error)
        setError('Failed to load content. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-32">
      <Hero />
      
      <section className="px-4">
        <ScrollAnimation>
          <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 hover:from-blue-300 hover:to-violet-300 transition-colors duration-300">              
            What I Do
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LoadingCard />
                </MotionDiv>
              ))
            ) : (
              services.map((service, index) => {
                const IconComponent = getIconComponent(service.title)
                
                return (
                  <MotionDiv
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                      onMouseEnter={() => setActiveCard(service.id)}
                      onMouseLeave={() => setActiveCard(null)}
                    >
                      <CardHeader>
                        <MotionDiv
                          animate={activeCard === service.id ? 
                            { rotate: 360, scale: 1.1 } : 
                            { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="mb-4 text-primary"
                        >
                          <IconComponent size={32} />
                        </MotionDiv>
                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                )
              })
            )}
          </div>
        </ScrollAnimation>
      </section>

      <section className="px-4 pb-20">
        <ScrollAnimation>
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400 hover:from-violet-300 hover:to-blue-300 transition-colors duration-300">
              Latest Projects
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LoadingProject />
                </MotionDiv>
              ))
            ) : (
              projects.map((project, index) => (
                <MotionDiv
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={project.link || `/portfolio/${project.id}`}>
                    <Card className="group h-full hover:shadow-lg transition-all duration-300">
                      {project.featured_image && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <img
                            src={project.featured_image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <ExternalLink className="text-white" size={24} />
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        {project.tags && (
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <MotionDiv
                                key={tag}
                                whileHover={{ scale: 1.1 }}
                                className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                              >
                                {tag}
                              </MotionDiv>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </MotionDiv>
              ))
            )}
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12"
          >
            <Link href="/portfolio">
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                View All Projects →
              </MotionDiv>
            </Link>
          </MotionDiv>
        </ScrollAnimation>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}