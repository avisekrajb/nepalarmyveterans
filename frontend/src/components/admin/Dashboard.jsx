import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Image, FileText, Calendar, Bell, Mail } from 'lucide-react';
import { leadershipAPI, galleryAPI, newsAPI, eventsAPI, noticesAPI, contactAPI } from '../../services/api';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    leadership: 0,
    gallery: 0,
    news: 0,
    events: 0,
    notices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leaders, gallery, news, events, notices] = await Promise.all([
          leadershipAPI.getLeadership(),
          galleryAPI.getGallery(),
          newsAPI.getNews(),
          eventsAPI.getEvents(),
          noticesAPI.getNotices(),
        ]);

        setStats({
          leadership: leaders.data.length,
          gallery: gallery.data.length,
          news: news.data.length,
          events: events.data.length,
          notices: notices.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Users, label: 'Leadership', value: stats.leadership, color: 'bg-blue-500' },
    { icon: Image, label: 'Gallery Items', value: stats.gallery, color: 'bg-purple-500' },
    { icon: FileText, label: 'News', value: stats.news, color: 'bg-green-500' },
    { icon: Calendar, label: 'Events', value: stats.events, color: 'bg-orange-500' },
    { icon: Bell, label: 'Notices', value: stats.notices, color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-army">Welcome, {admin?.email}</h2>
        <p className="text-gray-500">Manage your association website content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-army">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 bg-army/5 rounded-lg hover:bg-army/10 transition-colors text-army font-medium">
            Add Leader
          </button>
          <button className="p-4 bg-army/5 rounded-lg hover:bg-army/10 transition-colors text-army font-medium">
            Upload Gallery
          </button>
          <button className="p-4 bg-army/5 rounded-lg hover:bg-army/10 transition-colors text-army font-medium">
            Create News
          </button>
          <button className="p-4 bg-army/5 rounded-lg hover:bg-army/10 transition-colors text-army font-medium">
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;