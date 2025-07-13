import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import {
  TrendingUp, Calendar, Clock, Target, Award, Activity,
  Filter, Download, ChevronDown
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import Header from '../components/Header/Header';


const AnalyticsDashboard = () => {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // State for API data
  const [focusTimeData, setFocusTimeData] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [totalFocusHours, setTotalFocusHours] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics', {
          params: {
            userId: user.id,
            range: timeRange
          }
        });

        const data = res.data;

        setFocusTimeData(data.focusTimeTrend);
        setTaskDistribution(data.taskCategories);
        setWeeklyProgress(data.weeklyStats);
        setProductivityScore(data.productivityScore);
        setTotalFocusHours(data.totalFocusHours);
        setCompletedTasks(data.completedTasks);
        setCurrentStreak(data.currentStreak);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 mt-[20px]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your productivity insights and trends</p>
          </div>
          <div className="flex items-center flex-col md:flex-row gap-[10px] space-x-4">
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

        {/* Stat Cards */}
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

        {/* Tabs */}
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

        {/* Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorFocus)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Categories</h3>
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
                    <Cell key={`cell-${index}`} fill={entry.color || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color || '#ccc' }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Progress Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="focus" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tasks" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
