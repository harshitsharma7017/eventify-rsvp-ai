
import React, { useState } from 'react';
import { Plus, Search, Mail, UserCheck, UserX, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useGuests, useCreateGuest } from '@/hooks/useGuests';
import { useEvents } from '@/hooks/useEvents';

const GuestManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newGuestEmail, setNewGuestEmail] = useState('');

  const { data: guests = [], isLoading: guestsLoading } = useGuests();
  const { data: events = [] } = useEvents();
  const createGuest = useCreateGuest();

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.event_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const sendReminder = (guest: any) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder email sent to ${guest.name}`,
    });
  };

  const addGuest = () => {
    if (!newGuestEmail) return;
    
    // Get the first upcoming event as default
    const defaultEvent = events.find(e => e.status === 'upcoming') || events[0];
    if (!defaultEvent) {
      toast({
        title: "No Events Available",
        description: "Please create an event first before adding guests.",
        variant: "destructive"
      });
      return;
    }

    const guestData = {
      name: newGuestEmail.split('@')[0].replace(/[._]/g, ' '),
      email: newGuestEmail,
      status: 'pending' as const,
      event_id: defaultEvent.id,
      event_title: defaultEvent.title,
      rsvp_date: null
    };

    createGuest.mutate(guestData, {
      onSuccess: () => {
        setNewGuestEmail('');
      }
    });
  };

  const statusCounts = {
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    pending: guests.filter(g => g.status === 'pending').length,
    declined: guests.filter(g => g.status === 'declined').length
  };

  if (guestsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border border-green-500/30 animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-white/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-green-500/30 hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-white">{statusCounts.confirmed}</p>
              </div>
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-yellow-500/30 hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-white">{statusCounts.pending}</p>
              </div>
              <Mail className="w-6 h-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-red-500/30 hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Declined</p>
                <p className="text-2xl font-bold text-white">{statusCounts.declined}</p>
              </div>
              <UserX className="w-6 h-6 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Guests</p>
                <p className="text-2xl font-bold text-white">{guests.length}</p>
              </div>
              <Filter className="w-6 h-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Guest Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Guest */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter guest email address"
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
            <Button 
              onClick={addGuest} 
              disabled={createGuest.isPending || !newGuestEmail}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createGuest.isPending ? 'Adding...' : 'Add Guest'}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/20 text-white">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredGuests.map((guest, index) => (
              <div 
                key={guest.id} 
                className={`p-4 flex items-center justify-between hover:bg-white/10 transition-colors ${
                  index !== filteredGuests.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {getInitials(guest.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">{guest.name}</h3>
                    <p className="text-sm text-gray-300">{guest.email}</p>
                    <p className="text-xs text-gray-400">{guest.event_title}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(guest.status)}>
                    {guest.status.charAt(0).toUpperCase() + guest.status.slice(1)}
                  </Badge>
                  
                  {guest.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReminder(guest)}
                      className="text-blue-400 hover:text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Remind
                    </Button>
                  )}
                  
                  {guest.rsvp_date && (
                    <span className="text-xs text-gray-400">
                      RSVP: {new Date(guest.rsvp_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredGuests.length === 0 && (
            <div className="p-12 text-center">
              <Mail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Guests Found</h3>
              <p className="text-gray-400">Try adjusting your search or add some guests!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestManagement;
