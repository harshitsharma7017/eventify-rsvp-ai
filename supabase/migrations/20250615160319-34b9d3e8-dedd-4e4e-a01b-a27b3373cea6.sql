
-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 0,
  registered INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'declined')),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  rsvp_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add some sample data
INSERT INTO public.events (title, description, date, time, location, capacity, registered, status) VALUES
('Annual Tech Conference 2024', 'Join us for the biggest tech event of the year featuring industry leaders and breakthrough innovations.', '2024-03-15', '09:00', 'San Francisco Convention Center', 500, 2, 'upcoming'),
('Product Launch Webinar', 'Exclusive preview of our latest product features and roadmap discussion.', '2024-02-28', '14:00', 'Virtual Event', 200, 2, 'upcoming'),
('Team Building Workshop', 'Interactive workshop focused on collaboration and team dynamics.', '2024-02-10', '10:00', 'Company Headquarters', 50, 1, 'completed');

INSERT INTO public.guests (name, email, status, event_id, event_title, rsvp_date) VALUES
('Sarah Johnson', 'sarah.johnson@email.com', 'confirmed', (SELECT id FROM public.events WHERE title = 'Annual Tech Conference 2024'), 'Annual Tech Conference 2024', '2024-01-15'),
('Mike Chen', 'mike.chen@email.com', 'pending', (SELECT id FROM public.events WHERE title = 'Annual Tech Conference 2024'), 'Annual Tech Conference 2024', NULL),
('Emily Davis', 'emily.davis@email.com', 'declined', (SELECT id FROM public.events WHERE title = 'Product Launch Webinar'), 'Product Launch Webinar', '2024-01-20'),
('John Smith', 'john.smith@email.com', 'confirmed', (SELECT id FROM public.events WHERE title = 'Product Launch Webinar'), 'Product Launch Webinar', '2024-01-18'),
('Alex Wilson', 'alex.wilson@email.com', 'confirmed', (SELECT id FROM public.events WHERE title = 'Team Building Workshop'), 'Team Building Workshop', '2024-01-12');
