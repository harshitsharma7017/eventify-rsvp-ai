
import React, { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventDashboard from '@/components/EventDashboard';
import CreateEventForm from '@/components/CreateEventForm';
import GuestManagement from '@/components/GuestManagement';
import Analytics from '@/components/Analytics';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-600/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-400/10 to-cyan-600/10 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 animate-slide-in-right">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EventHub
              </h1>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in delay-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
            >
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="guests" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
            >
              <Users className="w-4 h-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-600/20 data-[state=active]:text-white transition-all duration-300 hover:bg-white/10"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <EventDashboard />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6 animate-fade-in">
            <GuestManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <Analytics />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center animate-pulse">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Calendar Integration</h3>
              <p className="text-blue-200 text-lg">Google Calendar sync coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default Index;
