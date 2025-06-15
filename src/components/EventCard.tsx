
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import EventDetails from './EventDetails';
import { useDeleteEvent } from '@/hooks/useEvents';
import type { Event } from '@/lib/supabase';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const deleteEvent = useDeleteEvent();
  
  const attendanceRate = (event.registered / event.capacity) * 100;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent.mutate(event.id);
    }
  };

  return (
    <>
      <Card 
        className="bg-white/5 backdrop-blur-xl border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 group hover:bg-white/10 hover:border-cyan-500/30 transform hover:scale-[1.02] hover:-translate-y-2 animate-fade-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-4 relative overflow-hidden">
          {/* Enhanced gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                {event.title}
              </CardTitle>
              <Badge 
                variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                className={`mt-3 transition-all duration-300 ${
                  event.status === 'upcoming' 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30'
                }`}
              >
                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                <DropdownMenuItem onClick={() => setShowDetails(true)} className="hover:bg-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-300 hover:bg-red-500/20"
                  disabled={deleteEvent.isPending}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-cyan-300 hover:text-cyan-200 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mr-3 border border-cyan-500/30">
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-purple-300 hover:text-purple-200 transition-colors duration-300">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-500/30">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center text-pink-300 hover:text-pink-200 transition-colors duration-300 col-span-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mr-3 border border-pink-500/30">
                <MapPin className="w-4 h-4 text-pink-400" />
              </div>
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-cyan-300 font-medium">RSVPs</span>
              <span className="font-bold text-white text-lg">
                {event.registered} / {event.capacity}
              </span>
            </div>
            <Progress 
              value={attendanceRate} 
              className="h-3 bg-white/10 rounded-full overflow-hidden"
            />
            <p className="text-xs text-cyan-400 font-medium">{attendanceRate.toFixed(1)}% capacity</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button 
            onClick={() => setShowDetails(true)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
          >
            <Users className="w-4 h-4 mr-2" />
            Manage RSVPs
          </Button>
        </CardFooter>
      </Card>

      {showDetails && (
        <EventDetails event={event} onClose={() => setShowDetails(false)} />
      )}
    </>
  );
};

export default EventCard;
