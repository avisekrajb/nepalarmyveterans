import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../services/api';
import { Eye, Users, FileText, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    dailyVisitors: [],
    monthlyVisitors: [],
    totalVisitors: 0,
    totalAdmins: 0,
    totalLogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('day');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const { data } = await superAdminAPI.getAnalytics({ period });
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Users, label: 'Total Admins', value: analytics.totalAdmins, color: 'text-blue-500 bg-blue-50' },
    { icon: Eye, label: 'Total Visitors', value: analytics.totalVisitors, color: 'text-green-500 bg-green-50' },
    { icon: FileText, label: 'Total Logs', value: analytics.totalLogs, color: 'text-purple-500 bg-purple-50' },
    { icon: TrendingUp, label: 'Today\'s Visits', value: analytics.dailyVisitors?.length || 0, color: 'text-orange-500 bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-army">Analytics Dashboard</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="day">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-army">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visitors Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-army mb-4">Daily Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.dailyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" label={{ value: 'Day', position: 'bottom' }} />
              <YAxis label={{ value: 'Visits', angle: -90, position: 'left' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#C9A227" strokeWidth={2} dot={{ fill: '#C9A227' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Visitors Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-army mb-4">Monthly Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" label={{ value: 'Month', position: 'bottom' }} />
              <YAxis label={{ value: 'Visits', angle: -90, position: 'left' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#C9A227" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* IP Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4">Visitor IP Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-army">{analytics.totalVisitors}</p>
            <p className="text-sm text-gray-500">Total Unique Visitors</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-army">{analytics.dailyVisitors?.length || 0}</p>
            <p className="text-sm text-gray-500">Today's Visitors</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-army">{analytics.monthlyVisitors?.length || 0}</p>
            <p className="text-sm text-gray-500">This Month</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-army">{analytics.totalAdmins}</p>
            <p className="text-sm text-gray-500">Total Admins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;