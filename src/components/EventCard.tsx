
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import EventDetails from './EventDetails';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  status: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);
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

  return (
    <>
      <Card className="bg-white/60 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {event.title}
              </CardTitle>
              <Badge 
                variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                className={`mt-2 ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
              >
                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              {event.time}
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              {event.location}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">RSVPs</span>
              <span className="font-medium text-gray-900">
                {event.registered} / {event.capacity}
              </span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
            <p className="text-xs text-gray-500">{attendanceRate.toFixed(1)}% capacity</p>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button 
            onClick={() => setShowDetails(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
