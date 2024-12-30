"use client"
import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionDiv } from "@/components/motion"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { BookOpen, Award, Code2, Briefcase } from 'lucide-react'

function AboutContent() {
  const [careers, setCareers] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [certifications, setCertifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadContent() {
      try {
        const [careersResult, skillsResult, certificationsResult] = await Promise.all([
          supabase.from('careers').select('*').order('orders'),
          supabase.from('skills').select('*').order('id'),
          supabase.from('certifications').select('*').order('issued_date', { ascending: false })
        ])

        if (careersResult.error) throw careersResult.error
        if (skillsResult.error) throw skillsResult.error
        if (certificationsResult.error) throw certificationsResult.error

        setCareers(careersResult.data || [])
        setSkills(skillsResult.data || [])
        setCertifications(certificationsResult.data || [])
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 py-20">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            About Me
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground">
              Hi, I'm Richard Kirkham. I'm a passionate software engineer with expertise in building modern web applications. 
              I love creating elegant solutions to complex problems and continuously learning new technologies.
            </p>
            <p className="text-xl leading-relaxed text-muted-foreground mt-4">
              I specialize in Python development, cloud architecture, and building efficient CI/CD pipelines. 
              With expertise in both traditional infrastructure and modern cloud-native solutions, 
              I focus on creating robust, scalable systems that drive operational excellence.
            </p>
          </div>
        </MotionDiv>

        <div className="grid gap-8 lg:grid-cols-2 mb-16">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full backdrop-blur-sm bg-card/50">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Experience</CardTitle>
                </div>
                <CardDescription>My professional journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careers.map((career, index) => (
                    <MotionDiv
                      key={career.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                      <div className="relative pl-6 pb-6 border-l-2 border-primary/30 last:pb-0">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary" />
                        <h3 className="font-semibold text-lg text-primary">{career.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {career.company} • {career.period}
                        </p>
                        <p className="text-muted-foreground">{career.description}</p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          <div className="space-y-8">
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Skills</CardTitle>
                  </div>
                  <CardDescription>Technologies and tools I work with</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <MotionDiv
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                      >
                        <span className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default">
                          {skill.name}
                        </span>
                      </MotionDiv>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Certifications</CardTitle>
                  </div>
                  <CardDescription>Professional certifications and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {certifications.map((cert, index) => (
                      <MotionDiv
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="group relative rounded-lg p-4 hover:bg-primary/5 transition-colors">
                          <div className="relative h-32 mb-4">
                            <Image
                              src={cert.image_url}
                              alt={cert.name}
                              fill
                              className="object-contain rounded-md group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <h3 className="font-semibold text-lg text-primary">{cert.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {cert.issuer} • Issued {new Date(cert.issued_date).toLocaleDateString()}
                          </p>
                          {cert.expiry_date && (
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </MotionDiv>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    }>
      <AboutContent />
    </Suspense>
  )
}