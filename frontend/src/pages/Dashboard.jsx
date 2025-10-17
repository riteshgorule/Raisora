import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Users, Target, Calendar, DollarSign, TrendingUp, Award, Globe, Heart, ArrowUp, ArrowDown, Activity, Clock } from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  // User participation data
  const userStats = {
    campaignsJoined: 12,
    eventsAttended: 8,
    totalDonations: 2450,
    impactScore: 850,
    rank: 'Gold Contributor',
    joinDate: 'January 2024'
  };

  // User's recent activities
  const userActivities = [
    { id: 1, type: 'campaign', title: 'Clean Water Initiative', action: 'Joined', date: '2 days ago', impact: '+50 points' },
    { id: 2, type: 'donation', title: 'Mental Health Awareness', action: 'Donated $100', date: '5 days ago', impact: '+100 points' },
    { id: 3, type: 'event', title: 'Climate Action Summit', action: 'Attended', date: '1 week ago', impact: '+75 points' },
    { id: 4, type: 'campaign', title: 'Education for All', action: 'Shared', date: '2 weeks ago', impact: '+25 points' }
  ];

  // Global statistics
  const globalStats = {
    totalCampaigns: 247,
    activeCampaigns: 89,
    totalEvents: 156,
    upcomingEvents: 23,
    totalDonations: 2847650,
    totalParticipants: 125000,
    countriesReached: 78,
    livesImpacted: 1250000
  };

  // Campaign participation data
  const campaignData = [
    { name: 'Environment', participated: 4, total: 15 },
    { name: 'Education', participated: 3, total: 12 },
    { name: 'Healthcare', participated: 2, total: 8 },
    { name: 'Human Rights', participated: 2, total: 10 },
    { name: 'Technology', participated: 1, total: 6 }
  ];

  // Monthly activity data
  const monthlyActivity = [
    { month: 'Jan', campaigns: 2, events: 1, donations: 200 },
    { month: 'Feb', campaigns: 3, events: 2, donations: 350 },
    { month: 'Mar', campaigns: 4, events: 2, donations: 500 },
    { month: 'Apr', campaigns: 2, events: 1, donations: 300 },
    { month: 'May', campaigns: 1, events: 2, donations: 400 },
    { month: 'Jun', campaigns: 0, events: 0, donations: 0 }
  ];

  // Global donations by category
  const donationsByCategory = [
    { name: 'Environment', value: 850000, color: '#02c39a' },
    { name: 'Education', value: 650000, color: '#f0f3bd' },
    { name: 'Healthcare', value: 750000, color: '#ff6b6b' },
    { name: 'Human Rights', value: 450000, color: '#4ecdc4' },
    { name: 'Technology', value: 142650, color: '#45b7d1' }
  ];

  // Global participation trends
  const participationTrends = [
    { month: 'Jan', participants: 95000, campaigns: 180, events: 45 },
    { month: 'Feb', participants: 102000, campaigns: 195, events: 52 },
    { month: 'Mar', participants: 108000, campaigns: 210, events: 48 },
    { month: 'Apr', participants: 115000, campaigns: 225, events: 55 },
    { month: 'May', participants: 125000, campaigns: 247, events: 62 }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'campaign': return <Target className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'donation': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'campaign': return 'bg-blue-100 text-blue-600';
      case 'event': return 'bg-green-100 text-green-600';
      case 'donation': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#02c39a] to-[#016b52] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Impact Dashboard</h1>
              <p className="text-xl opacity-90">Track your contributions and see the global impact we're making together</p>
            </div>
            <div className="mt-6 lg:mt-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#f0f3bd]">{userStats.impactScore}</div>
                <div className="text-sm opacity-90">Impact Score</div>
                <div className="mt-2 bg-[#f0f3bd] text-[#016b52] px-3 py-1 rounded-full text-xs font-semibold">
                  {userStats.rank}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campaigns Joined</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.campaignsJoined}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+2 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Events Attended</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.eventsAttended}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+1 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">${userStats.totalDonations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+$400 this month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-bold text-gray-900">{userStats.joinDate}</p>
              </div>
              <div className="w-12 h-12 bg-[#02c39a]/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-[#02c39a]" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Active for 5 months
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Activity Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Monthly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="campaigns" stackId="1" stroke="#02c39a" fill="#02c39a" fillOpacity={0.6} />
                <Area type="monotone" dataKey="events" stackId="1" stroke="#f0f3bd" fill="#f0f3bd" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign Participation */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Campaign Participation by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="participated" fill="#02c39a" name="Participated" />
                <Bar dataKey="total" fill="#e5e7eb" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {userActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.date}</p>
                  <p className="text-sm font-semibold text-[#02c39a]">{activity.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Statistics */}
        <div className="bg-gradient-to-br from-[#02c39a] to-[#016b52] rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Global Impact Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f0f3bd] mb-2">{globalStats.totalCampaigns}</div>
              <div className="text-sm opacity-90">Total Campaigns</div>
              <div className="text-xs opacity-75">{globalStats.activeCampaigns} active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f0f3bd] mb-2">{globalStats.totalEvents}</div>
              <div className="text-sm opacity-90">Total Events</div>
              <div className="text-xs opacity-75">{globalStats.upcomingEvents} upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f0f3bd] mb-2">${(globalStats.totalDonations / 1000000).toFixed(1)}M</div>
              <div className="text-sm opacity-90">Total Donations</div>
              <div className="text-xs opacity-75">This year</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f0f3bd] mb-2">{(globalStats.totalParticipants / 1000).toFixed(0)}K</div>
              <div className="text-sm opacity-90">Participants</div>
              <div className="text-xs opacity-75">{globalStats.countriesReached} countries</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-6xl font-bold text-[#f0f3bd] mb-2">{(globalStats.livesImpacted / 1000000).toFixed(1)}M</div>
            <div className="text-xl opacity-90">Lives Impacted Worldwide</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Global Donations by Category */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Global Donations by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donationsByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {donationsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Global Participation Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Global Participation Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={participationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="participants" stroke="#02c39a" strokeWidth={3} name="Participants" />
                <Line type="monotone" dataKey="campaigns" stroke="#f0f3bd" strokeWidth={2} name="Campaigns" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;