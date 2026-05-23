export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      careers: {
        Row: {
          id: number
          title: string
          company: string
          period: string
          description: string
          orders: number
          achievements?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          title: string
          company: string
          period: string
          description: string
          orders: number
          achievements?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          company?: string
          period?: string
          description?: string
          orders?: number
          achievements?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: number
          name: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          id: number
          name: string
          issuer: string
          image_url: string
          issued_date: string
          expiry_date?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          issuer: string
          image_url: string
          issued_date: string
          expiry_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          issuer?: string
          image_url?: string
          issued_date?: string
          expiry_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}