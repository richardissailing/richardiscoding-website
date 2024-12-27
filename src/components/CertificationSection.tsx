"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MotionDiv } from "@/components/motion"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

type CertificationRow = {
  id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiry_date?: string;
  image_url: string;
}

export default function CertificationSection() {
  const [certifications, setCertifications] = useState<CertificationRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function loadCertifications() {
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('issued_date', { ascending: false })

        if (error) throw error
        setCertifications((data as CertificationRow[]) || [])
      } catch (error) {
        console.error('Error loading certifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCertifications()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <MotionDiv
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
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
  )
}
