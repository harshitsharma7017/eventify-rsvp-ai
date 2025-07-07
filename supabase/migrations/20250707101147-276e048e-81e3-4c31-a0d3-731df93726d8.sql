-- Enhanced RSVP System: Guest categories and conditional questions
CREATE TYPE guest_category AS ENUM ('vip', 'regular', 'plus_one');
CREATE TYPE event_type AS ENUM ('corporate', 'wedding', 'conference', 'party', 'workshop', 'other');

-- Add guest categories to guests table
ALTER TABLE public.guests 
ADD COLUMN category guest_category DEFAULT 'regular',
ADD COLUMN dietary_restrictions TEXT,
ADD COLUMN special_requests TEXT,
ADD COLUMN plus_one_name TEXT,
ADD COLUMN plus_one_email TEXT;

-- Add event type and AI scheduling fields to events table
ALTER TABLE public.events
ADD COLUMN event_type event_type DEFAULT 'other',
ADD COLUMN ai_suggested_times JSONB,
ADD COLUMN optimal_time_score FLOAT;

-- Create waitlist table
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category guest_category DEFAULT 'regular',
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  notified_at TIMESTAMPTZ,
  promoted_at TIMESTAMPTZ
);

-- Create chat conversations table for AI chatbot
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  guest_email TEXT,
  guest_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'user' or 'ai'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create smart scheduling suggestions table
CREATE TABLE public.scheduling_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  suggested_date DATE,
  suggested_time TIME,
  confidence_score FLOAT,
  reasoning TEXT,
  factors_considered JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for waitlist (public read for event organizers)
CREATE POLICY "Anyone can view waitlist" ON public.waitlist FOR SELECT USING (true);
CREATE POLICY "Anyone can insert waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update waitlist" ON public.waitlist FOR UPDATE USING (true);

-- RLS policies for chat (public for guest interaction)
CREATE POLICY "Anyone can view conversations" ON public.chat_conversations FOR SELECT USING (true);
CREATE POLICY "Anyone can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update conversations" ON public.chat_conversations FOR UPDATE USING (true);

CREATE POLICY "Anyone can view messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- RLS policies for scheduling suggestions
CREATE POLICY "Anyone can view suggestions" ON public.scheduling_suggestions FOR SELECT USING (true);
CREATE POLICY "Anyone can create suggestions" ON public.scheduling_suggestions FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_waitlist_event_id ON public.waitlist(event_id);
CREATE INDEX idx_waitlist_position ON public.waitlist(position);
CREATE INDEX idx_chat_conversations_event_id ON public.chat_conversations(event_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_scheduling_suggestions_event_id ON public.scheduling_suggestions(event_id);