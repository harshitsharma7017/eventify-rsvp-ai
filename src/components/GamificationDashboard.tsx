import React, { useState } from 'react';
import { Trophy, Star, Flame, Award, Target, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';

interface GamificationDashboardProps {
  userId?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userId = 'demo-user' }) => {
  const { profile, badges, challenges, leaderboard, isLoading, loadLeaderboard } = useGamification(userId);
  const [activeLeaderboard, setActiveLeaderboard] = useState('points');

  React.useEffect(() => {
    loadLeaderboard(activeLeaderboard);
  }, [activeLeaderboard]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Calendar: <Award className="w-6 h-6" />,
      Crown: <Trophy className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      Award: <Award className="w-6 h-6" />,
      Flame: <Flame className="w-6 h-6" />,
      Heart: <Star className="w-6 h-6" />,
      Clock: <Target className="w-6 h-6" />,
    };
    return icons[iconName] || <Award className="w-6 h-6" />;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900/60 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-800 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Points</p>
                <p className="text-2xl font-bold text-cyan-200">{profile?.total_points || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Level</p>
                <p className="text-2xl font-bold text-cyan-200">{profile?.level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Streak</p>
                <p className="text-2xl font-bold text-cyan-200">{profile?.streak_count || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Badges</p>
                <p className="text-2xl font-bold text-cyan-200">{badges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/60 border border-slate-700/50">
          <TabsTrigger value="badges" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
            Badges
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-200">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <Card className="bg-slate-900/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-200">
                <Award className="w-5 h-5" />
                Your Badges ({badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <p className="text-center text-slate-400 py-8">
                  No badges earned yet. Start creating events and RSVPing to earn your first badge!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 text-center"
                    >
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                        {getIconComponent(badge.icon_name)}
                      </div>
                      <h3 className="font-semibold text-slate-200 mb-1">{badge.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{badge.description}</p>
                      <Badge className={`${getRarityColor(badge.rarity)} text-white`}>
                        {badge.rarity}
                      </Badge>
                      {badge.earned_at && (
                        <p className="text-xs text-slate-500 mt-2">
                          Earned {new Date(badge.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card className="bg-slate-900/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-200">
                <Target className="w-5 h-5" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.length === 0 ? (
                <p className="text-center text-slate-400 py-8">
                  No active challenges available right now. Check back soon!
                </p>
              ) : (
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-200">{challenge.title}</h3>
                          <p className="text-sm text-slate-400">{challenge.description}</p>
                        </div>
                        <Badge 
                          className={challenge.is_completed ? 'bg-green-500' : 'bg-blue-500'}
                        >
                          {challenge.is_completed ? 'Completed' : 'Active'}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">
                            Progress: {challenge.progress || 0}/{challenge.target_value}
                          </span>
                          <span className="text-cyan-400">
                            {challenge.points_reward} points
                          </span>
                        </div>
                        <Progress 
                          value={getProgressPercentage(challenge.progress || 0, challenge.target_value)}
                          className="h-2"
                        />
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {challenge.challenge_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-slate-900/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-200">
                <TrendingUp className="w-5 h-5" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Badge 
                  className={`cursor-pointer ${activeLeaderboard === 'points' ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  onClick={() => setActiveLeaderboard('points')}
                >
                  Points
                </Badge>
                <Badge 
                  className={`cursor-pointer ${activeLeaderboard === 'streak' ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  onClick={() => setActiveLeaderboard('streak')}
                >
                  Streaks
                </Badge>
              </div>

              {leaderboard.length === 0 ? (
                <p className="text-center text-slate-400 py-8">
                  No leaderboard data available yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-slate-700'
                      }`}>
                        {entry.rank}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-slate-200">
                          {entry.user_profiles?.display_name || entry.user_profiles?.username || 'Anonymous'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-cyan-400">
                          {entry.score} {activeLeaderboard === 'points' ? 'pts' : 'days'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;