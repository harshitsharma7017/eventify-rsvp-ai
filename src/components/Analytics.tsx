
import React from 'react';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const monthlyData = [
    { month: 'Jan', events: 4, attendees: 120 },
    { month: 'Feb', events: 6, attendees: 180 },
    { month: 'Mar', events: 8, attendees: 250 },
    { month: 'Apr', events: 5, attendees: 150 },
    { month: 'May', events: 7, attendees: 220 },
    { month: 'Jun', events: 9, attendees: 300 }
  ];

  const rsvpData = [
    { name: 'Confirmed', value: 65, color: '#10B981' },
    { name: 'Pending', value: 25, color: '#F59E0B' },
    { name: 'Declined', value: 10, color: '#EF4444' }
  ];

  const eventTypes = [
    { type: 'Conferences', count: 8, percentage: 40 },
    { type: 'Webinars', count: 6, percentage: 30 },
    { type: 'Workshops', count: 4, percentage: 20 },
    { type: 'Networking', count: 2, percentage: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-blue-500/30 hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:bg-slate-900/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">$24,500</p>
                <p className="text-xs text-blue-400 mt-1">+12% from last month</p>
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
                <p className="text-3xl font-bold text-white">87%</p>
                <p className="text-xs text-emerald-400 mt-1">+5% from last month</p>
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
                <p className="text-purple-400 text-sm font-medium">Events This Month</p>
                <p className="text-3xl font-bold text-white">9</p>
                <p className="text-xs text-purple-400 mt-1">+3 from last month</p>
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
                <p className="text-3xl font-bold text-white">73%</p>
                <p className="text-xs text-orange-400 mt-1">+8% from last month</p>
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
            <CardTitle className="text-white">Monthly Event Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
          </CardContent>
        </Card>

        {/* RSVP Status Chart */}
        <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white">RSVP Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rsvpData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  style={{ fill: '#F8FAFC' }}
                >
                  {rsvpData.map((entry, index) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Event Types Breakdown */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 hover:shadow-cyan-500/25 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white">Event Types Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventTypes.map((type, index) => (
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
                <span className="text-sm font-medium text-white">9/12</span>
              </div>
              <Progress value={75} />
              <p className="text-xs text-gray-400">3 more events to reach monthly goal</p>
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
                <span className="text-sm font-medium text-white">847/1000</span>
              </div>
              <Progress value={84.7} />
              <p className="text-xs text-gray-400">153 more attendees to reach target</p>
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
                <span className="text-sm font-medium text-white">$24.5K/$30K</span>
              </div>
              <Progress value={81.7} />
              <p className="text-xs text-gray-400">$5.5K more to reach monthly goal</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
