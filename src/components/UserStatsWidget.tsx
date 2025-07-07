import React from 'react';
import { Trophy, Star, Flame, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';

interface UserStatsWidgetProps {
  userId?: string;
  compact?: boolean;
}

const UserStatsWidget: React.FC<UserStatsWidgetProps> = ({ 
  userId = 'demo-user', 
  compact = false 
}) => {
  const { profile, badges } = useGamification(userId);

  if (!profile) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-slate-300">{profile.total_points}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-purple-500" />
          <span className="text-slate-300">Lv.{profile.level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-slate-300">{profile.streak_count}d</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-slate-900/60 border-cyan-500/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Level {profile.level}</p>
              <p className="text-sm text-slate-400">{profile.total_points} points</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500/20 text-orange-200 border-orange-500/30">
              <Flame className="w-3 h-3 mr-1" />
              {profile.streak_count} days
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
              <Award className="w-3 h-3 mr-1" />
              {badges.length}
            </Badge>
          </div>
        </div>
        
        {/* Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress to Level {profile.level + 1}</span>
            <span className="text-cyan-400">
              {profile.experience_points % 1000}/1000 XP
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(profile.experience_points % 1000) / 10}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsWidget;