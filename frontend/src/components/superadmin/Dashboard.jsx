import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../services/api';
import { Users, FileText, Image as ImageIcon, TrendingUp, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({
    dailyVisitors: [],
    monthlyVisitors: [],
    totalVisitors: 0,
    totalAdmins: 0,
    totalLogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data } = await superAdminAPI.getAnalytics();
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
              <Line type="monotone" dataKey="count" stroke="#C9A227" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Visitors Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-army mb-4">Monthly Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyVisitors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" label={{ value: 'Month', position: 'bottom' }} />
              <YAxis label={{ value: 'Visits', angle: -90, position: 'left' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8B2331" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;