-- Gamification System Tables

-- User profiles for gamification
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Points transactions log
CREATE TABLE public.points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'event_created', 'rsvp_confirmed', 'event_attended', 'referral', etc.
  description TEXT,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Badges/Achievements system
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT, -- lucide icon name
  badge_type TEXT DEFAULT 'achievement', -- 'achievement', 'milestone', 'special'
  points_required INTEGER,
  criteria JSONB, -- flexible criteria for earning badge
  rarity TEXT DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User badges earned
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  progress INTEGER DEFAULT 100, -- percentage progress (100 = completed)
  UNIQUE(user_id, badge_id)
);

-- Challenges/Quests
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT, -- 'daily', 'weekly', 'monthly', 'special'
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  points_reward INTEGER,
  badge_reward UUID REFERENCES public.badges(id),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User challenge progress
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- Leaderboards
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  leaderboard_type TEXT, -- 'points', 'events_created', 'events_attended', 'streak'
  score INTEGER,
  rank INTEGER,
  period TEXT DEFAULT 'all_time', -- 'daily', 'weekly', 'monthly', 'all_time'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, leaderboard_type, period)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own points" ON public.points_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert points" ON public.points_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "System can manage badges" ON public.badges FOR ALL USING (true);

CREATE POLICY "Users can view all user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can manage user badges" ON public.user_badges FOR ALL USING (true);

CREATE POLICY "Everyone can view challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "System can manage challenges" ON public.challenges FOR ALL USING (true);

CREATE POLICY "Users can view own challenge progress" ON public.user_challenges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can manage user challenges" ON public.user_challenges FOR ALL USING (true);

CREATE POLICY "Everyone can view leaderboards" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "System can manage leaderboards" ON public.leaderboard_entries FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_points_transactions_user_id ON public.points_transactions(user_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_leaderboard_entries_type_period ON public.leaderboard_entries(leaderboard_type, period);
CREATE INDEX idx_leaderboard_entries_rank ON public.leaderboard_entries(rank);

-- Insert default badges
INSERT INTO public.badges (name, description, icon_name, badge_type, points_required, rarity) VALUES
('First Event', 'Create your first event', 'Calendar', 'milestone', 0, 'common'),
('Event Master', 'Create 10 events', 'Crown', 'milestone', 500, 'rare'),
('Social Butterfly', 'RSVP to 5 events', 'Users', 'milestone', 100, 'common'),
('Party Animal', 'RSVP to 25 events', 'PartyPopper', 'milestone', 500, 'rare'),
('Perfect Attendance', 'Attend 10 events in a row', 'Award', 'achievement', 1000, 'epic'),
('Streak Master', 'Maintain a 30-day activity streak', 'Flame', 'achievement', 1500, 'epic'),
('Community Builder', 'Help 100 people with RSVPs', 'Heart', 'special', 2000, 'legendary'),
('Early Bird', 'RSVP within 1 hour of event creation', 'Clock', 'achievement', 200, 'rare');

-- Insert sample challenges
INSERT INTO public.challenges (title, description, challenge_type, target_value, points_reward, start_date, end_date) VALUES
('Weekly Event Creator', 'Create 3 events this week', 'weekly', 3, 300, date_trunc('week', CURRENT_DATE), date_trunc('week', CURRENT_DATE) + interval '7 days'),
('Social Explorer', 'RSVP to 5 different events this month', 'monthly', 5, 250, date_trunc('month', CURRENT_DATE), date_trunc('month', CURRENT_DATE) + interval '1 month'),
('Daily Check-in', 'Log in daily for 7 consecutive days', 'daily', 7, 150, CURRENT_DATE, CURRENT_DATE + interval '7 days');