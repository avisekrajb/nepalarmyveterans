import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Image, 
  FileText, 
  Calendar, 
  Bell, 
  Mail,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Settings,
  Shield,
  Clock,
  ChevronRight,
  Zap,
  Eye
} from 'lucide-react';
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  leadershipAPI, 
  galleryAPI, 
  newsAPI, 
  eventsAPI, 
  noticesAPI, 
  contactAPI,
  heroAPI,
  interviewAPI
} from '../../services/api';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    leadership: 0,
    gallery: 0,
    news: 0,
    events: 0,
    notices: 0,
    contacts: 0,
    interviews: 0,
    heroImages: 0,
    seniors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [totalContent, setTotalContent] = useState(0);

  const COLORS = ['#C9A227', '#1F3D2B', '#8B2331', '#2E5940', '#C9A227', '#6B4C3B'];

  useEffect(() => {
    fetchAllRealData();
  }, []);

  const fetchAllRealData = async () => {
    setLoading(true);
    try {
      const [
        leadersRes, 
        galleryRes, 
        newsRes, 
        eventsRes, 
        noticesRes, 
        contactRes,
        heroRes,
        interviewsRes
      ] = await Promise.all([
        leadershipAPI.getLeadership(),
        galleryAPI.getGallery(),
        newsAPI.getNews(),
        eventsAPI.getEvents(),
        noticesAPI.getNotices(),
        contactAPI.getContact(),
        heroAPI.getHero(),
        interviewAPI.getInterviews()
      ]);

      const leadershipCount = leadersRes.data?.length || 0;
      const galleryCount = galleryRes.data?.length || 0;
      const newsCount = newsRes.data?.length || 0;
      const eventsCount = eventsRes.data?.length || 0;
      const noticesCount = noticesRes.data?.length || 0;
      const contactsCount = contactRes.data ? 1 : 0;
      const interviewsCount = interviewsRes.data?.length || 0;
      const heroImagesCount = heroRes.data?.carouselImages?.length || 0;
      const seniorsCount = heroRes.data?.seniors?.length || 0;

      const newStats = {
        leadership: leadershipCount,
        gallery: galleryCount,
        news: newsCount,
        events: eventsCount,
        notices: noticesCount,
        contacts: contactsCount,
        interviews: interviewsCount,
        heroImages: heroImagesCount,
        seniors: seniorsCount,
      };

      setStats(newStats);
      setTotalContent(
        leadershipCount + galleryCount + newsCount + eventsCount + 
        noticesCount + interviewsCount + heroImagesCount + seniorsCount
      );

      // Pie Data
      const realPieData = [
        { name: 'Leadership', value: leadershipCount || 1, color: '#C9A227' },
        { name: 'Gallery', value: galleryCount || 1, color: '#1F3D2B' },
        { name: 'News', value: newsCount || 1, color: '#8B2331' },
        { name: 'Events', value: eventsCount || 1, color: '#2E5940' },
        { name: 'Notices', value: noticesCount || 1, color: '#C9A227' },
        { name: 'Interviews', value: interviewsCount || 1, color: '#6B4C3B' },
      ];
      setPieData(realPieData);

      // Line Data
      const allItems = [
        ...(leadersRes.data || []).map(item => ({ ...item, type: 'leadership' })),
        ...(galleryRes.data || []).map(item => ({ ...item, type: 'gallery' })),
        ...(newsRes.data || []).map(item => ({ ...item, type: 'news' })),
        ...(eventsRes.data || []).map(item => ({ ...item, type: 'events' })),
        ...(noticesRes.data || []).map(item => ({ ...item, type: 'notices' })),
        ...(interviewsRes.data || []).map(item => ({ ...item, type: 'interviews' })),
      ];

      const monthMap = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      allItems.forEach(item => {
        if (item.createdAt) {
          const date = new Date(item.createdAt);
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          const key = `${month} ${year}`;
          if (!monthMap[key]) {
            monthMap[key] = { name: month, count: 0, year: year };
          }
          monthMap[key].count += 1;
        }
      });

      const realLineData = Object.values(monthMap)
        .sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year;
          return months.indexOf(a.name) - months.indexOf(b.name);
        })
        .map(item => ({
          name: item.name,
          items: item.count,
        }));

      setLineData(realLineData.length > 0 ? realLineData : [
        { name: 'Jan', items: 0 },
        { name: 'Feb', items: 0 },
        { name: 'Mar', items: 0 },
        { name: 'Apr', items: 0 },
        { name: 'May', items: 0 },
        { name: 'Jun', items: 0 },
      ]);

      // Bar Data
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayItems = allItems.filter(item => {
          if (!item.createdAt) return false;
          const itemDate = new Date(item.createdAt);
          return itemDate.toDateString() === date.toDateString();
        });
        last7Days.push({
          name: dayName,
          posts: dayItems.length,
          views: Math.floor(Math.random() * 50) + 10,
        });
      }
      setBarData(last7Days);

      // Recent Activities - Improved with better text handling
      const sortedItems = allItems
        .filter(item => item.createdAt)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      const activityMap = {
        leadership: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Leader' },
        gallery: { icon: Image, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Gallery' },
        news: { icon: FileText, color: 'text-green-500', bg: 'bg-green-50', label: 'News' },
        events: { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Event' },
        notices: { icon: Bell, color: 'text-red-500', bg: 'bg-red-50', label: 'Notice' },
        interviews: { icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Interview' },
      };

      const activities = sortedItems.map(item => {
        const meta = activityMap[item.type] || activityMap.news;
        const Icon = meta.icon;
        const timeDiff = Math.floor((new Date() - new Date(item.createdAt)) / (1000 * 60));
        let timeString = 'Just now';
        if (timeDiff > 60) {
          const hours = Math.floor(timeDiff / 60);
          timeString = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (timeDiff > 0) {
          timeString = `${timeDiff} min ago`;
        }
        
        // Get title or name, truncate if too long
        let title = item.title || item.name || 'Untitled';
        const maxLength = 40;
        if (title.length > maxLength) {
          title = title.substring(0, maxLength) + '...';
        }

        return {
          action: `New ${meta.label} added: ${title}`,
          time: timeString,
          icon: Icon,
          color: meta.color,
          bg: meta.bg,
          fullTitle: item.title || item.name || 'Untitled',
          type: item.type,
        };
      });

      setRecentActivities(activities.length > 0 ? activities : [
        { 
          action: 'No recent activities found', 
          time: 'Now', 
          icon: Activity, 
          color: 'text-gray-400',
          bg: 'bg-gray-50',
          fullTitle: 'No activities',
          type: 'none'
        }
      ]);

    } catch (error) {
      console.error('Error fetching real data:', error);
      setLineData([
        { name: 'Jan', items: 0 },
        { name: 'Feb', items: 0 },
        { name: 'Mar', items: 0 },
        { name: 'Apr', items: 0 },
        { name: 'May', items: 0 },
        { name: 'Jun', items: 0 },
      ]);
      setBarData([
        { name: 'Mon', posts: 0, views: 0 },
        { name: 'Tue', posts: 0, views: 0 },
        { name: 'Wed', posts: 0, views: 0 },
        { name: 'Thu', posts: 0, views: 0 },
        { name: 'Fri', posts: 0, views: 0 },
        { name: 'Sat', posts: 0, views: 0 },
        { name: 'Sun', posts: 0, views: 0 },
      ]);
      setPieData([
        { name: 'No Data', value: 1, color: '#C9A227' },
      ]);
      setRecentActivities([
        { 
          action: 'No recent activities', 
          time: 'Now', 
          icon: Activity, 
          color: 'text-gray-400',
          bg: 'bg-gray-50',
          fullTitle: 'No activities',
          type: 'none'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Users, label: 'Leadership', value: stats.leadership, bg: 'bg-blue-50', text: 'text-blue-500' },
    { icon: Image, label: 'Gallery Items', value: stats.gallery, bg: 'bg-purple-50', text: 'text-purple-500' },
    { icon: FileText, label: 'News', value: stats.news, bg: 'bg-green-50', text: 'text-green-500' },
    { icon: Calendar, label: 'Events', value: stats.events, bg: 'bg-orange-50', text: 'text-orange-500' },
    { icon: Bell, label: 'Notices', value: stats.notices, bg: 'bg-red-50', text: 'text-red-500' },
    { icon: Mail, label: 'Contacts', value: stats.contacts, bg: 'bg-teal-50', text: 'text-teal-500' },
    { icon: Users, label: 'Interviews', value: stats.interviews, bg: 'bg-indigo-50', text: 'text-indigo-500' },
    { icon: Eye, label: 'Hero Images', value: stats.heroImages, bg: 'bg-yellow-50', text: 'text-yellow-500' },
    { icon: Users, label: 'Seniors', value: stats.seniors, bg: 'bg-pink-50', text: 'text-pink-500' },
  ];

  const quickActions = [
    { label: 'Add Leader', icon: Users, path: '/admin/leadership', color: 'bg-blue-500' },
    { label: 'Upload Gallery', icon: Image, path: '/admin/gallery', color: 'bg-purple-500' },
    { label: 'Create News', icon: FileText, path: '/admin/news', color: 'bg-green-500' },
    { label: 'Add Event', icon: Calendar, path: '/admin/events', color: 'bg-orange-500' },
    { label: 'Add Notice', icon: Bell, path: '/admin/notices', color: 'bg-red-500' },
    { label: 'Settings', icon: Settings, path: '/admin/settings', color: 'bg-gray-500' },
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
      {/* Dark Green Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-900 to-green-800 p-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">Admin Dashboard</span>
            </div>
            <h1 className="text-white font-bold text-2xl md:text-3xl">
              Welcome back, {admin?.email?.split('@')[0] || 'Admin'}!
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Here's what's happening with your association today
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                System Active
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <p className="text-white font-bold text-xl">{totalContent}</p>
              <p className="text-green-100 text-xs">Total Content</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
              <p className="text-white font-bold text-xl">{stats.contacts}</p>
              <p className="text-green-100 text-xs">Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.slice(0, 9).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-3 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.text}`} />
                </div>
                <div>
                  <p className="text-lg font-bold text-army">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 truncate">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Graph */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-army">Content Trend</h3>
            </div>
            <span className="text-xs text-gray-500">
              {lineData.reduce((acc, d) => acc + d.items, 0)} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <ReLineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="items" stroke="#C9A227" strokeWidth={2} dot={{ r: 3 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Graph */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-army">Weekly Activity</h3>
            </div>
            <span className="text-xs text-gray-500">
              {barData.reduce((acc, d) => acc + d.posts, 0)} posts
            </span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Bar dataKey="posts" fill="#1F3D2B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Graph */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-gold" />
              <h3 className="text-sm font-semibold text-army">Content Distribution</h3>
            </div>
            <span className="text-xs text-gray-500">
              {pieData.reduce((acc, curr) => acc + curr.value, 0)} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '10px' }} />
              <Legend wrapperStyle={{ fontSize: '8px' }} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-army mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-gold" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium hover:scale-105 transition-transform ${action.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate text-xs">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Responsive with overflow handling */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-army mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-gold" />
            Recent Activity
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${activity.bg || 'bg-transparent'}`}
                >
                  <div className={`p-1.5 rounded-full flex-shrink-0 mt-0.5 ${activity.bg || 'bg-gray-100'} ${activity.color}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 break-words leading-relaxed">
                      {activity.action}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
          {/* Scroll indicator if more than 4 items */}
          {recentActivities.length > 4 && (
            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400">
                Scroll for more ({recentActivities.length} activities)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;