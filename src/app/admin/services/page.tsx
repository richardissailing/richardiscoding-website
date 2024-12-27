"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Service {
  id: number
  title: string
  description: string
  icon?: string
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id')
        .returns<Service[]>()

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleServiceUpdate(service: Service) {
    setSaving(true)
    try {
      const serviceData: Record<string, unknown> = {
        id: service.id,
        title: service.title,
        description: service.description,
        icon: service.icon || null
      }

      const { error } = await supabase
        .from('services')
        .upsert(serviceData)
        .select()
        .returns<Service>()
      
      if (error) throw error
      await loadServices()
    } catch (error) {
      console.error('Error updating service:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleServiceDelete(id: number) {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .match({ id })
      
      if (error) throw error
      await loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  function handleAddNew() {
    const newService: Service = {
      id: Date.now(), // Temporary ID for new items
      title: '',
      description: '',
      icon: ''
    }
    setServices([...services, newService])
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Button onClick={handleAddNew}>Add New Service</Button>
      </div>

      <div className="grid gap-6">
        {services.map((service, index) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => {
                    const updated = [...services]
                    updated[index] = { ...service, title: e.target.value }
                    setServices(updated)
                  }}
                  placeholder="Service title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => {
                    const updated = [...services]
                    updated[index] = { ...service, description: e.target.value }
                    setServices(updated)
                  }}
                  placeholder="Service description"
                />
              </div>

              <div className="space-y-2">
                <Label>Icon (optional)</Label>
                <Input
                  value={service.icon || ''}
                  onChange={(e) => {
                    const updated = [...services]
                    updated[index] = { ...service, icon: e.target.value }
                    setServices(updated)
                  }}
                  placeholder="Icon class or URL"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleServiceDelete(service.id)}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleServiceUpdate(service)}
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