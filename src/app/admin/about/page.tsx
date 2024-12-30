"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Career {
  id: number
  title: string
  company: string
  period: string
  description: string
  orders: number
}

interface NewCareer extends Omit<Career, 'id'> {
  id?: number
}

interface Skill {
  id: number
  name: string
  category?: string
}

export default function AboutAdmin() {
  const [careers, setCareers] = useState<(Career | NewCareer)[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      const [careersResult, skillsResult] = await Promise.all([
        supabase
          .from('careers')
          .select('*')
          .order('orders'),
        supabase
          .from('skills')
          .select('*')
          .order('name')
      ])

      if (careersResult.error) throw careersResult.error
      if (skillsResult.error) throw skillsResult.error

      setCareers(careersResult.data || [])
      setSkills(skillsResult.data || [])
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCareerUpdate(career: Career | NewCareer) {
    setSaving(true)
    try {
      const careerData: Partial<Career> = {
        title: career.title,
        company: career.company,
        period: career.period,
        description: career.description,
        orders: career.orders
      }
      
      // Only include id if it's a valid database ID
      if (Number.isInteger(career.id)) {
        careerData.id = career.id
      }
      
      const { error } = await supabase
        .from('careers')
        .upsert(careerData)
        .select()
      
      if (error) throw error
      await loadContent()
    } catch (error) {
      console.error('Error updating career:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleCareerDelete(id: number) {
    if (!confirm('Are you sure you want to delete this career item?')) return
    
    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .match({ id })
      
      if (error) throw error
      await loadContent()
    } catch (error) {
      console.error('Error deleting career:', error)
    }
  }

  async function handleSkillAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newSkill.trim()) return

    try {
      const { error } = await supabase
        .from('skills')
        .insert({ name: newSkill.trim() })
        .select()
      
      if (error) throw error
      setNewSkill("")
      await loadContent()
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  async function handleSkillDelete(id: number) {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .match({ id })

      if (error) throw error
      await loadContent()
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  function handleAddNewCareer() {
    const newCareer: NewCareer = {
      title: '',
      company: '',
      period: '',
      description: '',
      orders: careers.length + 1
    }
    setCareers([...careers, newCareer])
  }

  function handleCareerFieldUpdate(index: number, field: keyof Career, value: string) {
    const updated = [...careers]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    setCareers(updated)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage About Page</h1>
        <Button onClick={handleAddNewCareer}>Add New Career Item</Button>
      </div>

      {/* Skills Management */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSkillAdd} className="flex gap-2 mb-4">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill..."
            />
            <Button type="submit">Add Skill</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() => handleSkillDelete(skill.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Delete ${skill.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Career Items */}
      <div className="space-y-8">
        {careers.map((career, index) => (
          <Card key={career.id || index}>
            <CardHeader>
              <CardTitle>Career Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Job Title"
                value={career.title}
                onChange={(e) => handleCareerFieldUpdate(index, 'title', e.target.value)}
              />
              
              <Input
                placeholder="Company"
                value={career.company}
                onChange={(e) => handleCareerFieldUpdate(index, 'company', e.target.value)}
              />
              
              <Input
                placeholder="Period (e.g., 2020-2023)"
                value={career.period}
                onChange={(e) => handleCareerFieldUpdate(index, 'period', e.target.value)}
              />
              
              <Textarea
                placeholder="Description"
                value={career.description}
                onChange={(e) => handleCareerFieldUpdate(index, 'description', e.target.value)}
              />

              <div className="flex justify-end gap-2">
                {career.id && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCareerDelete(career.id as number)}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  onClick={() => handleCareerUpdate(career)}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}