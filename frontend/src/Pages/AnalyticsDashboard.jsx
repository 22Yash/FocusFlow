import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, Award, Activity, Filter, Download, ChevronDown } from 'lucide-react';
import Header from '../components/Header/Header';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const focusTimeData = [
    { day: 'Mon', hours: 2.5, sessions: 3 },
    { day: 'Tue', hours: 4.2, sessions: 5 },
    { day: 'Wed', hours: 3.8, sessions: 4 },
    { day: 'Thu', hours: 5.1, sessions: 6 },
    { day: 'Fri', hours: 3.2, sessions: 4 },
    { day: 'Sat', hours: 6.5, sessions: 7 },
    { day: 'Sun', hours: 4.8, sessions: 5 }
  ];

  const taskDistribution = [
    { name: 'Work', value: 45, color: '#8B5CF6' },
    { name: 'Personal', value: 25, color: '#06B6D4' },
    { name: 'Learning', value: 20, color: '#10B981' },
    { name: 'Health', value: 10, color: '#F59E0B' }
  ];

  const weeklyProgress = [
    { week: 'Week 1', focus: 18, tasks: 12, streak: 5 },
    { week: 'Week 2', focus: 22, tasks: 15, streak: 7 },
    { week: 'Week 3', focus: 26, tasks: 18, streak: 6 },
    { week: 'Week 4', focus: 31, tasks: 22, streak: 7 }
  ];

  const productivityScore = 87;
  const totalFocusHours = 156;
  const completedTasks = 89;
  const currentStreak = 12;

  const StatCard = ({ icon: Icon, title, value, change, trend, color = "blue" }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {change}%
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
      <Header/>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your productivity insights and trends</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Target}
            title="Productivity Score"
            value={`${productivityScore}%`}
            change="+12"
            trend="up"
            color="purple"
          />
          <StatCard 
            icon={Clock}
            title="Total Focus Time"
            value={`${totalFocusHours}h`}
            change="+8"
            trend="up"
            color="blue"
          />
          <StatCard 
            icon={Activity}
            title="Tasks Completed"
            value={completedTasks}
            change="+15"
            trend="up"
            color="green"
          />
          <StatCard 
            icon={Award}
            title="Current Streak"
            value={`${currentStreak} days`}
            change="+3"
            trend="up"
            color="orange"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1 mb-8 shadow-sm border border-gray-100">
          <div className="flex space-x-1">
            {['overview', 'focus', 'tasks', 'habits'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Focus Time Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Focus Time</h3>
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Hours focused
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={focusTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8B5CF6" 
                  fill="url(#colorFocus)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Categories</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="focus" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tasks" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Peak Performance</h3>
            </div>
            <p className="text-purple-100 mb-3">Your most productive day this week was Thursday with 5.1 hours of focused work.</p>
            <div className="text-2xl font-bold">Thursday</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Clock className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Best Time</h3>
            </div>
            <p className="text-blue-100 mb-3">You're most focused between 9 AM - 11 AM. Consider scheduling important tasks during this time.</p>
            <div className="text-2xl font-bold">9-11 AM</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Achievement</h3>
            </div>
            <p className="text-green-100 mb-3">You've maintained a 12-day streak! Keep up the momentum to reach your monthly goal.</p>
            <div className="text-2xl font-bold">12 Days</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;