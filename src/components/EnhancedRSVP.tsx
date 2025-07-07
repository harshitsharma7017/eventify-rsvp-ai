import React, { useState, useEffect } from 'react';
import { Users, Crown, UserPlus, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWaitlist } from '@/hooks/useWaitlist';
import { useToast } from '@/hooks/use-toast';

interface EnhancedRSVPProps {
  eventId: string;
  eventTitle: string;
  currentCapacity: number;
  currentRegistered: number;
}

const EnhancedRSVP: React.FC<EnhancedRSVPProps> = ({
  eventId,
  eventTitle,
  currentCapacity,
  currentRegistered
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'regular' as 'vip' | 'regular' | 'plus_one',
    dietaryRestrictions: '',
    specialRequests: '',
    plusOneName: '',
    plusOneEmail: ''
  });

  const { waitlist, isLoading, addToWaitlist, promoteFromWaitlist, getWaitlist } = useWaitlist();
  const { toast } = useToast();
  const [showWaitlist, setShowWaitlist] = useState(false);

  const isEventFull = currentRegistered >= currentCapacity;

  useEffect(() => {
    getWaitlist(eventId);
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (isEventFull) {
      // Add to waitlist
      await addToWaitlist(eventId, {
        name: formData.name,
        email: formData.email,
        category: formData.category
      });
    } else {
      // Regular RSVP logic would go here
      toast({
        title: "RSVP Submitted",
        description: "Your RSVP has been confirmed!",
      });
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      category: 'regular',
      dietaryRestrictions: '',
      specialRequests: '',
      plusOneName: '',
      plusOneEmail: ''
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vip': return <Crown className="w-4 h-4" />;
      case 'plus_one': return <UserPlus className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vip': return 'bg-yellow-500 text-black';
      case 'plus_one': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/60 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-200">
            <Users className="w-5 h-5" />
            Enhanced RSVP System
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{currentRegistered}/{currentCapacity} registered</span>
            {isEventFull && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Event Full - Waitlist Available
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-slate-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Guest Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: 'vip' | 'regular' | 'plus_one') => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="regular">Regular Guest</SelectItem>
                  <SelectItem value="vip">VIP Guest</SelectItem>
                  <SelectItem value="plus_one">Plus One</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.category === 'plus_one' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="space-y-2">
                  <Label className="text-slate-300">Plus One Name</Label>
                  <Input
                    value={formData.plusOneName}
                    onChange={(e) => setFormData({ ...formData, plusOneName: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                    placeholder="Plus one's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Plus One Email</Label>
                  <Input
                    type="email"
                    value={formData.plusOneEmail}
                    onChange={(e) => setFormData({ ...formData, plusOneEmail: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-200"
                    placeholder="Plus one's email"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-slate-300">Dietary Restrictions</Label>
              <Input
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200"
                placeholder="e.g., Vegetarian, Gluten-free, No nuts"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Special Requests</Label>
              <Textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="bg-slate-800 border-slate-700 text-slate-200"
                placeholder="Any special accommodations or requests..."
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={isLoading}
            >
              {isEventFull ? 'Join Waitlist' : 'Confirm RSVP'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Waitlist Management */}
      <Card className="bg-slate-900/60 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-cyan-200">
              <Clock className="w-5 h-5" />
              Waitlist Management
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWaitlist(!showWaitlist)}
                className="border-slate-700 text-slate-300"
              >
                {showWaitlist ? 'Hide' : 'Show'} Waitlist ({waitlist.length})
              </Button>
              {waitlist.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => promoteFromWaitlist(eventId)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Promote Next
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {showWaitlist && waitlist.length > 0 && (
          <CardContent>
            <div className="space-y-3">
              {waitlist.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-bold text-white">
                      {entry.position}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{entry.name}</p>
                      <p className="text-sm text-slate-400">{entry.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(entry.category)}>
                      {getCategoryIcon(entry.category)}
                      {entry.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
        
        {showWaitlist && waitlist.length === 0 && (
          <CardContent>
            <p className="text-center text-slate-400 py-8">
              No one is currently on the waitlist.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EnhancedRSVP;