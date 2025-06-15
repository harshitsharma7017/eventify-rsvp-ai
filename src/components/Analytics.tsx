
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-900">$24,500</p>
                <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Avg. Attendance</p>
                <p className="text-3xl font-bold text-green-900">87%</p>
                <p className="text-xs text-green-600 mt-1">+5% from last month</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Events This Month</p>
                <p className="text-3xl font-bold text-purple-900">9</p>
                <p className="text-xs text-purple-600 mt-1">+3 from last month</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-900">73%</p>
                <p className="text-xs text-orange-600 mt-1">+8% from last month</p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Events Chart */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Monthly Event Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendees" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* RSVP Status Chart */}
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>RSVP Status Distribution</CardTitle>
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
                >
                  {rsvpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Types Breakdown */}
      <Card className="bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Event Types Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <span className="font-medium text-gray-900">{type.type}</span>
                </div>
                <div className="flex items-center space-x-4 flex-1 max-w-xs">
                  <Progress value={type.percentage} className="flex-1" />
                  <span className="text-sm text-gray-600 min-w-0">{type.count} events</span>
                  <span className="text-sm font-medium text-gray-900 min-w-0">{type.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Events Created</span>
                <span className="text-sm font-medium">9/12</span>
              </div>
              <Progress value={75} />
              <p className="text-xs text-gray-500">3 more events to reach monthly goal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Attendance Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Attendees</span>
                <span className="text-sm font-medium">847/1000</span>
              </div>
              <Progress value={84.7} />
              <p className="text-xs text-gray-500">153 more attendees to reach target</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-sm font-medium">$24.5K/$30K</span>
              </div>
              <Progress value={81.7} />
              <p className="text-xs text-gray-500">$5.5K more to reach monthly goal</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
