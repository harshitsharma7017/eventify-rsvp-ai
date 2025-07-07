
import React, { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventDashboard from '@/components/EventDashboard';
import CreateEventForm from '@/components/CreateEventForm';
import GuestManagement from '@/components/GuestManagement';
import Analytics from '@/components/Analytics';
import AIChatbot from '@/components/AIChatbot';
import SmartScheduling from '@/components/SmartScheduling';
import EnhancedRSVP from '@/components/EnhancedRSVP';
import GamificationDashboard from '@/components/GamificationDashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-600/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-indigo-400/10 to-cyan-600/10 blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-400/15 to-teal-600/15 blur-2xl animate-pulse delay-700"></div>
      </div>

      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in delay-200">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Manage Events Like a Pro
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create stunning events, track RSVPs, and analyze performance with our AI-powered platform
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 px-8 py-3 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Event
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full h-14 grid-cols-5 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-1 gap-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-green-900 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/40 rounded-xl text-slate-300 hover:text-slate-200 font-medium"
            >
              <Calendar className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="guests" 
              className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-green-900 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/40 rounded-xl text-slate-300 hover:text-slate-200 font-medium"
            >
              <Users className="w-4 h-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-green-900 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/40 rounded-xl text-slate-300 hover:text-slate-200 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-green-900 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/40 rounded-xl text-slate-300 hover:text-slate-200 font-medium"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="gamification" 
              className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-600/20 data-[state=active]:text-green-900 data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-300 hover:bg-slate-800/40 rounded-xl text-slate-300 hover:text-slate-200 font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Gamification
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
            <SmartScheduling />
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6 animate-fade-in">
            <GamificationDashboard />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {/* Create Event Modal */}
      {showCreateForm && (
        <CreateEventForm onClose={() => setShowCreateForm(false)} />
      )}
      
      <AIChatbot 
        eventId="demo-event"
        eventTitle="Sample Event"
        guestEmail="demo@example.com"
        guestName="Demo User"
      />
    </div>
  );
};

export default Index;
