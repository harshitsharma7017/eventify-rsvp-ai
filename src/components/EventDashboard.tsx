
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, TrendingUp, Award, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 backdrop-blur-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-white">{events.length}</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-2xl">
                <Calendar className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 backdrop-blur-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Total RSVPs</p>
                <p className="text-3xl font-bold text-white">
                  {events.reduce((sum, event) => sum + event.registered, 0)}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/20 backdrop-blur-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-white">{upcomingEvents.length}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20 backdrop-blur-xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Avg. Attendance</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round(events.reduce((sum, event) => sum + (event.registered / event.capacity) * 100, 0) / events.length)}%
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-2xl">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
          Upcoming Events
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl flex items-center justify-center animate-pulse">
                <Calendar className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No Upcoming Events</h3>
              <p className="text-gray-400 text-lg">Create your first event to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Events */}
      {completedEvents.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
            Recent Events
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
