"use client"
import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionDiv } from "@/components/motion"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import Image from 'next/image'
import type { Database } from '@/lib/supabase/database.types'

type CareerRow = Database['public']['Tables']['careers']['Row']
type SkillRow = Database['public']['Tables']['skills']['Row']
type CertificationRow = Database['public']['Tables']['certifications']['Row']

function AboutContent() {
  const [careers, setCareers] = useState<CareerRow[]>([])
  const [skills, setSkills] = useState<SkillRow[]>([])
  const [certifications, setCertifications] = useState<CertificationRow[]>([])
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

        setCareers(careersResult.data as CareerRow[] || [])
        setSkills(skillsResult.data as SkillRow[] || [])
        setCertifications(certificationsResult.data as CertificationRow[] || [])
      } catch (error) {
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
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
            About Me
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hi, I&apos;m Richard Kirkham. I&apos;m a passionate software engineer with expertise in building modern web applications. 
            I love creating elegant solutions to complex problems and continuously learning new technologies.
          </p>
        </MotionDiv>

        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Experience</CardTitle>
                <CardDescription>My professional journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careers.map((career, index) => (
                    <MotionDiv
                      key={career.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="border-l-2 border-primary pl-4 py-2">
                        <h3 className="font-semibold text-lg">{career.title}</h3>
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

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Skills</CardTitle>
                <CardDescription>Technologies and tools I work with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <MotionDiv
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    >
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        {skill.name}
                      </span>
                    </MotionDiv>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Certifications</CardTitle>
              <CardDescription>Professional certifications and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {certifications.map((cert, index) => (
                  <MotionDiv
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="relative"
                  >
                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="relative h-40 mb-4">
                        <Image
                          src={cert.image_url}
                          alt={cert.name}
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
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
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutContent />
    </Suspense>
  )
}