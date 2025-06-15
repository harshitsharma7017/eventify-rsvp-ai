
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, MoreVertical, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import EventCard from './EventCard';

const EventDashboard = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Tech Conference 2024",
      description: "Join us for the biggest tech event of the year featuring industry leaders and breakthrough innovations.",
      date: "2024-03-15",
      time: "09:00",
      location: "San Francisco Convention Center",
      capacity: 500,
      registered: 234,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Product Launch Webinar",
      description: "Exclusive preview of our latest product features and roadmap discussion.",
      date: "2024-02-28",
      time: "14:00",
      location: "Virtual Event",
      capacity: 200,
      registered: 156,
      status: "upcoming"
    },
    {
      id: 3,
      title: "Team Building Workshop",
      description: "Interactive workshop focused on collaboration and team dynamics.",
      date: "2024-02-10",
      time: "10:00",
      location: "Company Headquarters",
      capacity: 50,
      registered: 45,
      status: "completed"
    }
  ]);

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-blue-900">{events.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total RSVPs</p>
                <p className="text-3xl font-bold text-green-900">
                  {events.reduce((sum, event) => sum + event.registered, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-purple-900">{upcomingEvents.length}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg. Attendance</p>
                <p className="text-3xl font-bold text-orange-900">
                  {Math.round(events.reduce((sum, event) => sum + (event.registered / event.capacity) * 100, 0) / events.length)}%
                </p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500">Create your first event to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Events */}
      {completedEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
