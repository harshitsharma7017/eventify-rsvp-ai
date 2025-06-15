
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Event = {
  id: string
  title: string
  description: string | null
  date: string
  time: string
  location: string
  capacity: number
  registered: number
  status: 'upcoming' | 'completed'
  created_at: string
  updated_at: string
}

export type Guest = {
  id: string
  name: string
  email: string
  status: 'confirmed' | 'pending' | 'declined'
  event_id: string | null
  event_title: string
  rsvp_date: string | null
  created_at: string
  updated_at: string
}
