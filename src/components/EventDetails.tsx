
import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, Mail, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGuests } from '@/hooks/useGuests';
import type { Event } from '@/lib/supabase';

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: allGuests = [] } = useGuests();

  // Filter guests for this specific event
  const guests = allGuests.filter(guest => guest.event_id === event.id);
  
  const attendanceRate = (event.registered / event.capacity) * 100;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendInvites = () => {
    toast({
      title: "Invitations Sent",
      description: "Email invitations have been sent to all pending guests.",
    });
  };

  const exportGuestList = () => {
    toast({
      title: "Export Complete",
      description: "Guest list has been exported to CSV.",
    });
  };

  const statusCounts = {
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    pending: guests.filter(g => g.status === 'pending').length,
    declined: guests.filter(g => g.status === 'declined').length
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900">{event.title}</CardTitle>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {event.time}
              </div>
              <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="guests">Guests ({guests.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-blue-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-3 text-blue-500" />
                      {event.registered} / {event.capacity} registered
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{event.description || 'No description provided.'}</p>
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Registration Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Registration Progress</span>
                      <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={attendanceRate} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</p>
                        <p className="text-xs text-green-600">Confirmed</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
                        <p className="text-xs text-yellow-600">Pending</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-red-600">{statusCounts.declined}</p>
                        <p className="text-xs text-red-600">Declined</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={sendInvites} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invites
                </Button>
                <Button variant="outline" onClick={exportGuestList}>
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="guests" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Guest List</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportGuestList}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={sendInvites}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reminders
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {getInitials(guest.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{guest.name}</p>
                        <p className="text-sm text-gray-600">{guest.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(guest.status)}>
                      {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                
                {guests.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No guests registered for this event yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-900">{attendanceRate.toFixed(1)}%</p>
                    <p className="text-sm text-blue-600">Registration Rate</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-900">
                      {guests.length > 0 ? (statusCounts.confirmed / guests.length * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-green-600">Confirmation Rate</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-900">{event.capacity - event.registered}</p>
                    <p className="text-sm text-purple-600">Spots Available</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Registration Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Capacity</span>
                      <span className="font-semibold">{event.capacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Registrations</span>
                      <span className="font-semibold">{event.registered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Available Spots</span>
                      <span className="font-semibold">{event.capacity - event.registered}</span>
                    </div>
                    <Progress value={attendanceRate} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
