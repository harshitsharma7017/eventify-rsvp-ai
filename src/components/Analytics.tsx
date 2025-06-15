
import React from 'react';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

const Analytics = () => {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Analytics error:', error);
    return (
      <div className="space-y-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-red-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">Error loading analytics data. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // Monthly goal calculations
  const monthlyGoalEvents = 12;
  const monthlyGoalAttendees = 1000;
  const monthlyGoalRevenue = 30000;
  
  const eventGoalProgress = analytics.totalEvents > 0 ? Math.min((analytics.totalEvents / monthlyGoalEvents) * 100, 100) : 0;
  const attendeeGoalProgress = analytics.totalRegistered > 0 ? Math.min((analytics.totalRegistered / monthlyGoalAttendees) * 100, 100) : 0;
  const revenueGoalProgress = analytics.revenue > 0 ? Math.min((analytics.revenue / monthlyGoalRevenue) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${analytics.revenue.toLocaleString()}</p>
                <p className="text-xs text-blue-400 mt-1">From confirmed guests</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-400/30">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/30 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Avg. Attendance</p>
                <p className="text-3xl font-bold text-white">{analytics.attendanceRate}%</p>
                <p className="text-xs text-emerald-400 mt-1">{analytics.totalRegistered}/{analytics.totalCapacity} capacity filled</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/30 hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-white">{analytics.totalEvents}</p>
                <p className="text-xs text-purple-400 mt-1">{analytics.totalGuests} total guests</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30">
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-orange-500/30 hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-400 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-white">{analytics.conversionRate}%</p>
                <p className="text-xs text-orange-400 mt-1">{analytics.confirmedGuests} confirmed guests</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-400/30">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Events Chart */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">Event Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }} 
                  />
                  <Bar dataKey="events" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendees" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No event data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSVP Status Chart */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">RSVP Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.totalGuests > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.rsvpData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                    style={{ fill: '#F8FAFC' }}
                  >
                    {analytics.rsvpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#F8FAFC'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No guest data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Types Breakdown */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Event Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.totalEvents > 0 ? (
            <div className="space-y-4">
              {analytics.eventTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <span className="font-medium text-white">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-4 flex-1 max-w-xs">
                    <Progress value={type.percentage} className="flex-1" />
                    <span className="text-sm text-gray-300 min-w-0">{type.count} events</span>
                    <span className="text-sm font-medium text-white min-w-0">{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No events created yet. Start by creating your first event!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-white">Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Events Created</span>
                <span className="text-sm font-medium text-white">{analytics.totalEvents}/{monthlyGoalEvents}</span>
              </div>
              <Progress value={eventGoalProgress} />
              <p className="text-xs text-gray-400">
                {Math.max(0, monthlyGoalEvents - analytics.totalEvents)} more events to reach monthly goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-white">Attendance Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Attendees</span>
                <span className="text-sm font-medium text-white">{analytics.totalRegistered}/{monthlyGoalAttendees}</span>
              </div>
              <Progress value={attendeeGoalProgress} />
              <p className="text-xs text-gray-400">
                {Math.max(0, monthlyGoalAttendees - analytics.totalRegistered)} more attendees to reach target
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-white">Revenue Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Revenue</span>
                <span className="text-sm font-medium text-white">${(analytics.revenue / 1000).toFixed(1)}K/${(monthlyGoalRevenue / 1000)}K</span>
              </div>
              <Progress value={revenueGoalProgress} />
              <p className="text-xs text-gray-400">
                ${((monthlyGoalRevenue - analytics.revenue) / 1000).toFixed(1)}K more to reach monthly goal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
