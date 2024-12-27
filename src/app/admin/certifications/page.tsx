"use client"
import { useState, useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issued_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional().nullable(),
  image: z.instanceof(FileList).optional()
})

type CertificationRow = {
  id: number
  name: string
  issuer: string
  issued_date: string
  expiry_date?: string
  image_url: string
  created_at: string
}

export default function CertificationsAdmin() {
  const [certifications, setCertifications] = useState<CertificationRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issued_date: "",
      expiry_date: "",
      image: undefined
    }
  })

  useEffect(() => {
    loadCertifications()
  }, [])

  async function loadCertifications() {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issued_date', { ascending: false })
        .returns<CertificationRow[]>()
  
      if (error) throw error
      setCertifications(data || [])
    } catch (error) {
      console.error('Error loading certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form values:', values)
    try {
      setLoading(true)
      
      // Validate file exists
      if (!values.image || !values.image[0]) {
        throw new Error('No image file selected')
      }

      const file = values.image[0]
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      })

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      console.log('Uploading file:', fileName)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certifications')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certifications')
        .getPublicUrl(fileName)

      console.log('Public URL:', publicUrl)

      // Prepare certification data
      const certificationData = {
        name: values.name,
        issuer: values.issuer,
        issued_date: values.issued_date,
        expiry_date: values.expiry_date || null,
        image_url: publicUrl
      }

      console.log('Inserting certification:', certificationData)

      // Insert record
      const { data: insertData, error: insertError } = await supabase
        .from('certifications')
        .insert([certificationData])
        .select()

      if (insertError) {
        console.error('Database insert error:', insertError)
        throw insertError
      }

      console.log('Insert successful:', insertData)

      form.reset({
        name: "",
        issuer: "",
        issued_date: "",
        expiry_date: "",
        image: undefined
      })
      loadCertifications()
    } catch (error) {
      console.error('Error adding certification:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    } finally {
      setLoading(false)
    }
  }

  async function deleteCertification(id: number, imageUrl: string) {
    try {
      setLoading(true)
      
      // Delete image from storage
      const fileName = imageUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('certifications')
          .remove([fileName])
      }

      // Delete record
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      loadCertifications()
    } catch (error) {
      console.error('Error deleting certification:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Certifications</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Certification</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issuer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issued_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Certificate Image</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files?.length) {
                              onChange(files);
                            }
                          }}
                          {...field}
                          value={undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Add Certification
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-lg">{cert.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 mb-4">
                <Image
                  src={cert.image_url}
                  alt={cert.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {cert.issuer}
                </p>
                <p className="text-sm text-muted-foreground">
                  Issued: {new Date(cert.issued_date).toLocaleDateString()}
                </p>
                {cert.expiry_date && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4 w-full"
                onClick={() => deleteCertification(cert.id, cert.image_url)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}