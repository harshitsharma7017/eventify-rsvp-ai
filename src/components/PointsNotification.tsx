import React, { useEffect, useState } from 'react';
import { Trophy, Star, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PointsNotificationProps {
  points: number;
  action: string;
  onClose: () => void;
}

const PointsNotification: React.FC<PointsNotificationProps> = ({ points, action, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-fade-in">
      <Card className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border-yellow-400/50 shadow-2xl backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">+{points} Points!</p>
              <p className="text-sm text-yellow-100">{action}</p>
            </div>
            <div className="flex gap-1">
              <Star className="w-4 h-4 text-yellow-200 animate-pulse" />
              <Star className="w-4 h-4 text-yellow-200 animate-pulse delay-100" />
              <Star className="w-4 h-4 text-yellow-200 animate-pulse delay-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsNotification;