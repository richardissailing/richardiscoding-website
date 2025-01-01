export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          achievements: Text
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
          created_at?: string
          updated_at?: string
        }
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
  }
}