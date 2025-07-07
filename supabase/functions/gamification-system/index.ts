import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PointsAction {
  event_created: number;
  rsvp_confirmed: number;
  event_attended: number;
  daily_login: number;
  referral_completed: number;
  profile_completed: number;
}

const POINTS_SYSTEM: PointsAction = {
  event_created: 100,
  rsvp_confirmed: 25,
  event_attended: 50,
  daily_login: 10,
  referral_completed: 200,
  profile_completed: 50,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, eventId, metadata } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case 'award_points':
        return await awardPoints(supabase, userId, metadata.actionType, metadata.description, eventId);
      
      case 'check_badges':
        return await checkAndAwardBadges(supabase, userId);
      
      case 'update_streak':
        return await updateUserStreak(supabase, userId);
      
      case 'get_user_profile':
        return await getUserGamificationProfile(supabase, userId);
      
      case 'get_leaderboard':
        return await getLeaderboard(supabase, metadata.type, metadata.period);
      
      case 'update_challenge_progress':
        return await updateChallengeProgress(supabase, userId, metadata.challengeType, metadata.progress);

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Gamification system error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function awardPoints(supabase: any, userId: string, actionType: string, description: string, eventId: string | null) {
  const points = POINTS_SYSTEM[actionType as keyof PointsAction] || 0;
  
  if (points === 0) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid action type' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Record points transaction
  const { error: transactionError } = await supabase
    .from('points_transactions')
    .insert({
      user_id: userId,
      points,
      action_type: actionType,
      description,
      event_id: eventId
    });

  if (transactionError) throw transactionError;

  // Update user profile points
  const { error: profileError } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      total_points: supabase.raw(`COALESCE(total_points, 0) + ${points}`),
      experience_points: supabase.raw(`COALESCE(experience_points, 0) + ${points}`),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (profileError) {
    // Fallback: get current points and update
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('total_points, experience_points')
      .eq('user_id', userId)
      .single();

    const newTotalPoints = (currentProfile?.total_points || 0) + points;
    const newExpPoints = (currentProfile?.experience_points || 0) + points;
    const newLevel = Math.floor(newExpPoints / 1000) + 1;

    await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        total_points: newTotalPoints,
        experience_points: newExpPoints,
        level: newLevel,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  }

  // Check for new badges
  await checkAndAwardBadges(supabase, userId);

  return new Response(JSON.stringify({ 
    success: true, 
    points_awarded: points,
    action_type: actionType 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function checkAndAwardBadges(supabase: any, userId: string) {
  // Get user's current stats
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!userProfile) return;

  // Get user's current badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  const earnedBadgeIds = userBadges?.map(ub => ub.badge_id) || [];

  // Get all available badges
  const { data: allBadges } = await supabase
    .from('badges')
    .select('*');

  const newBadges = [];

  for (const badge of allBadges || []) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    let shouldAward = false;

    // Check badge criteria
    switch (badge.name) {
      case 'First Event':
        const { count: eventCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId);
        shouldAward = eventCount > 0;
        break;
      
      case 'Event Master':
        const { count: masterEventCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId);
        shouldAward = masterEventCount >= 10;
        break;
      
      case 'Social Butterfly':
        const { count: rsvpCount } = await supabase
          .from('guests')
          .select('*', { count: 'exact', head: true })
          .eq('email', userProfile.email);
        shouldAward = rsvpCount >= 5;
        break;
      
      case 'Streak Master':
        shouldAward = userProfile.streak_count >= 30;
        break;
    }

    if (shouldAward) {
      await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badge.id
        });
      newBadges.push(badge);
    }
  }

  return newBadges;
}

async function updateUserStreak(supabase: any, userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!userProfile) {
    // Create profile if it doesn't exist
    await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        streak_count: 1,
        last_activity_date: today
      });
    return;
  }

  const lastActivity = userProfile.last_activity_date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = userProfile.streak_count || 0;

  if (lastActivity === yesterdayStr) {
    // Continue streak
    newStreak += 1;
  } else if (lastActivity !== today) {
    // Reset streak
    newStreak = 1;
  }

  await supabase
    .from('user_profiles')
    .update({
      streak_count: newStreak,
      last_activity_date: today
    })
    .eq('user_id', userId);

  return newStreak;
}

async function getUserGamificationProfile(supabase: any, userId: string) {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: badges } = await supabase
    .from('user_badges')
    .select(`
      *,
      badges (*)
    `)
    .eq('user_id', userId);

  const { data: recentTransactions } = await supabase
    .from('points_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return new Response(JSON.stringify({
    profile,
    badges,
    recent_transactions: recentTransactions
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getLeaderboard(supabase: any, type: string, period: string) {
  const { data: leaderboard } = await supabase
    .from('leaderboard_entries')
    .select(`
      *,
      user_profiles (display_name, username, avatar_url)
    `)
    .eq('leaderboard_type', type)
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(50);

  return new Response(JSON.stringify({ leaderboard }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateChallengeProgress(supabase: any, userId: string, challengeType: string, progress: number) {
  // Get active challenges of this type
  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('challenge_type', challengeType)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString());

  for (const challenge of challenges || []) {
    // Update or insert user challenge progress
    await supabase
      .from('user_challenges')
      .upsert({
        user_id: userId,
        challenge_id: challenge.id,
        progress: Math.min(progress, challenge.target_value),
        is_completed: progress >= challenge.target_value,
        completed_at: progress >= challenge.target_value ? new Date().toISOString() : null
      }, { onConflict: 'user_id,challenge_id' });

    // Award points if completed
    if (progress >= challenge.target_value) {
      await awardPoints(supabase, userId, 'challenge_completed', `Completed: ${challenge.title}`, null);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}