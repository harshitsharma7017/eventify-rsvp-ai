
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nczsgimzexsfsddhlkku.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jenNnaW16ZXhzZnNkZGhsa2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDE4ODgsImV4cCI6MjA2NTU3Nzg4OH0.7IS12j6CQP33oXfnmdLTN-W3EUTib9vLNWdY6zL-r-o'

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
