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

interface Skill {
  id: number
  name: string
  category?: string
}

export default function AboutAdmin() {
  const [careers, setCareers] = useState<Career[]>([])
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
      // Load careers with type assertion
      const { data: careersData, error: careersError } = await supabase
        .from('careers')
        .select('*')
        .order('orders')
        .returns<Career[]>()

      if (careersError) throw careersError

      // Load skills with type assertion
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('name')
        .returns<Skill[]>()

      if (skillsError) throw skillsError

      setCareers(careersData || [])
      setSkills(skillsData || [])
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCareerUpdate(career: Career) {
    setSaving(true)
    try {
      // Convert Career object to a plain object that matches Supabase's expected type
      const careerData: Record<string, unknown> = {
        id: career.id,
        title: career.title,
        company: career.company,
        period: career.period,
        description: career.description,
        orders: career.orders
      }
      
      const { error } = await supabase
        .from('careers')
        .upsert(careerData)
        .select()
        .returns<Career>()
      
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
        .returns<Skill>()

      if (error) throw error
      setNewSkill("")
      await loadContent()
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  async function handleSkillDelete(id: number) {
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
    const newCareer: Career = {
      id: Math.random(), // Temporary ID for new items
      title: '',
      company: '',
      period: '',
      description: '',
      orders: careers.length + 1
    }
    setCareers([...careers, newCareer])
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
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
                onChange={(e) => {
                  const updated = [...careers]
                  updated[index].title = e.target.value
                  setCareers(updated)
                }}
              />
              
              <Input
                placeholder="Company"
                value={career.company}
                onChange={(e) => {
                  const updated = [...careers]
                  updated[index].company = e.target.value
                  setCareers(updated)
                }}
              />
              
              <Input
                placeholder="Period (e.g., 2020-2023)"
                value={career.period}
                onChange={(e) => {
                  const updated = [...careers]
                  updated[index].period = e.target.value
                  setCareers(updated)
                }}
              />
              
              <Textarea
                placeholder="Description"
                value={career.description}
                onChange={(e) => {
                  const updated = [...careers]
                  updated[index].description = e.target.value
                  setCareers(updated)
                }}
              />

              <div className="flex justify-end gap-2">
                {career.id && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCareerDelete(career.id)}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  onClick={() => handleCareerUpdate(career)}
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