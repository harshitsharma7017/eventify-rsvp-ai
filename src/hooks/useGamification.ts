import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  total_points: number;
  level: number;
  experience_points: number;
  streak_count: number;
  last_activity_date?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  badge_type: string;
  rarity: string;
  earned_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  points_reward: number;
  progress?: number;
  is_completed?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  user_profiles: {
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export const useGamification = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const awardPoints = async (actionType: string, description: string, eventId?: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'award_points',
          userId,
          eventId,
          metadata: { actionType, description }
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Points Earned! 🎉",
          description: `You earned ${data.points_awarded} points for ${description}`,
        });
        
        // Refresh profile
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const updateStreak = async () => {
    if (!userId) return;

    try {
      await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'update_streak',
          userId
        }
      });
      
      await loadUserProfile();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'get_user_profile',
          userId
        }
      });

      if (error) throw error;

      setProfile(data.profile);
      setBadges(data.badges?.map((ub: any) => ({
        ...ub.badges,
        earned_at: ub.earned_at
      })) || []);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenges = async () => {
    try {
      const { data: activeChallenges, error } = await supabase
        .from('challenges')
        .select(`
          *,
          user_challenges!inner (progress, is_completed)
        `)
        .eq('is_active', true)
        .eq('user_challenges.user_id', userId)
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString());

      if (error) throw error;

      const challengesWithProgress = activeChallenges?.map(challenge => ({
        ...challenge,
        progress: challenge.user_challenges?.[0]?.progress || 0,
        is_completed: challenge.user_challenges?.[0]?.is_completed || false
      })) || [];

      setChallenges(challengesWithProgress);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const loadLeaderboard = async (type = 'points', period = 'all_time') => {
    try {
      const { data, error } = await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'get_leaderboard',
          metadata: { type, period }
        }
      });

      if (error) throw error;
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const updateChallengeProgress = async (challengeType: string, progress: number) => {
    if (!userId) return;

    try {
      await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'update_challenge_progress',
          userId,
          metadata: { challengeType, progress }
        }
      });

      await loadChallenges();
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadChallenges();
      updateStreak();
    }
  }, [userId]);

  return {
    profile,
    badges,
    challenges,
    leaderboard,
    isLoading,
    awardPoints,
    updateStreak,
    loadUserProfile,
    loadChallenges,
    loadLeaderboard,
    updateChallengeProgress
  };
};