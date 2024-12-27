"use client"
import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface Message {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Message[]>()

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: number) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id)
        .select()
        .returns<Message>()

      if (error) throw error
      loadMessages()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Messages</h1>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-6 rounded-lg shadow ${message.read ? 'bg-card/50' : 'bg-card'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{message.name}</h3>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="mb-4">{message.message}</p>
              {!message.read && (
                <button
                  onClick={() => markAsRead(message.id)}
                  className="text-sm text-primary hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}