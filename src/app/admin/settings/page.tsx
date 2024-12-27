"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface Settings {
  id: string
  site_name: string
  site_description: string
  contact_email: string
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>({
    id: '1',
    site_name: '',
    site_description: '',
    contact_email: '',
    social_links: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single() as { data: Settings | null, error: Error | null }

      if (error) throw error
      if (data) {
        // Ensure social_links is initialized if it's null
        const processedData: Settings = {
          ...data,
          social_links: data.social_links || {}
        }
        setSettings(processedData)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      // Convert Settings object to a plain object for Supabase
      const settingsData: Record<string, unknown> = {
        id: settings.id,
        site_name: settings.site_name,
        site_description: settings.site_description,
        contact_email: settings.contact_email,
        social_links: settings.social_links
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsData)
        .select()
        .returns<Settings>()

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully."
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">General Settings</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Name</label>
            <Input
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              placeholder="Your Site Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Site Description</label>
            <Textarea
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              placeholder="Brief description of your site"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email</label>
            <Input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="contact@example.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Social Links</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={settings.social_links.github || ''}
              onChange={(e) => setSettings({
                ...settings,
                social_links: { ...settings.social_links, github: e.target.value }
              })}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              value={settings.social_links.linkedin || ''}
              onChange={(e) => setSettings({
                ...settings,
                social_links: { ...settings.social_links, linkedin: e.target.value }
              })}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter URL</label>
            <Input
              value={settings.social_links.twitter || ''}
              onChange={(e) => setSettings({
                ...settings,
                social_links: { ...settings.social_links, twitter: e.target.value }
              })}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>
      </div>
    </div>
  )
}