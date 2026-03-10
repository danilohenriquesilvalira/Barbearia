// Tipos do schema Supabase — NÃO contém dados sensíveis

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string
          name:       string
          phone:      string
          created_at: string
        }
        Insert: {
          id:          string
          name?:       string | null
          phone?:      string | null
          created_at?: string | null
        }
        Update: {
          name?:  string | null
          phone?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id:           string
          user_id:      string
          service_id:   string
          service_name: string
          barber_id:    string
          barber_name:  string
          date:         string
          time_slot:    string
          price:        number
          status:       string
          created_at:   string
        }
        Insert: {
          id?:          string | null
          user_id:      string
          service_id:   string
          service_name: string
          barber_id:    string
          barber_name:  string
          date:         string
          time_slot:    string
          price:        number
          status?:      string | null
          created_at?:  string | null
        }
        Update: {
          status?: string | null
        }
        Relationships: []
      }
    }
    Views:          Record<string, never>
    Functions:      Record<string, never>
    Enums:          Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
