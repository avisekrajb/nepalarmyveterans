import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { noticesAPI } from '../services/api';
import { Bell, Calendar, AlertCircle, Info, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data } = await noticesAPI.getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
      // Fallback data
      setNotices([
        {
          _id: '1',
          title: 'Annual General Meeting 2024',
          content: 'The Annual General Meeting of the Nepal National Ex-Army Association will be held on December 15, 2024 at 10:00 AM at the association headquarters. All members are requested to attend.',
          date: new Date('2024-12-15').toISOString(),
          priority: 'high'
        },
        {
          _id: '2',
          title: 'New Membership Drive',
          content: 'We are excited to announce a new membership drive starting from November 1, 2024. All veterans are encouraged to join and become part of our growing community.',
          date: new Date('2024-11-01').toISOString(),
          priority: 'high'
        },
        {
          _id: '3',
          title: 'Health Camp Announcement',
          content: 'A free health camp for veterans and their families will be organized on October 10-12, 2024 at the Kathmandu Medical College. Specialists from various fields will be available.',
          date: new Date('2024-10-10').toISOString(),
          priority: 'medium'
        },
        {
          _id: '4',
          title: 'Office Holiday Notice',
          content: 'The association office will remain closed on October 17, 2024 on the occasion of Dashain festival. Normal operations will resume on October 18, 2024.',
          date: new Date('2024-10-17').toISOString(),
          priority: 'low'
        },
        {
          _id: '5',
          title: 'Scholarship Program for Veterans Children',
          content: 'Applications are invited for the scholarship program for children of veterans. The scholarship covers tuition fees and educational materials for deserving students.',
          date: new Date('2024-09-20').toISOString(),
          priority: 'medium'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: AlertCircle,
      medium: Info,
      low: Bell,
    };
    return icons[priority] || Bell;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-500 bg-red-50 border-red-200',
      medium: 'text-yellow-500 bg-yellow-50 border-yellow-200',
      low: 'text-blue-500 bg-blue-50 border-blue-200',
    };
    return colors[priority] || 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Urgent',
      medium: 'Important',
      low: 'General',
    };
    return labels[priority] || 'General';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.priority === filter);

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Announcements</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Notices & Updates
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Stay informed with the latest announcements and important updates from the association.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-gold text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'high'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Urgent
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'medium'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'low'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              General
            </button>
          </div>

          {/* Notices List */}
          <div className="space-y-4">
            {filteredNotices.map((notice) => {
              const PriorityIcon = getPriorityIcon(notice.priority);
              return (
                <div
                  key={notice._id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border-l-4 overflow-hidden cursor-pointer ${
                    notice.priority === 'high' ? 'border-red-500' :
                    notice.priority === 'medium' ? 'border-yellow-500' :
                    'border-blue-500'
                  }`}
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getPriorityColor(notice.priority)}`}>
                        <PriorityIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-army text-lg">
                            {notice.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                            notice.priority === 'high' ? 'bg-red-500 text-white' :
                            notice.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {getPriorityLabel(notice.priority)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredNotices.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notices available for this filter.</p>
            </div>
          )}
        </div>
      </Container>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <button
                className="float-right text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                onClick={() => setSelectedNotice(null)}
              >
                ×
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full text-white ${
                  selectedNotice.priority === 'high' ? 'bg-red-500' :
                  selectedNotice.priority === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}>
                  {getPriorityLabel(selectedNotice.priority)}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(selectedNotice.date)}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-army">
                {selectedNotice.title}
              </h2>

              <div className="mt-4 prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  <strong>Notice ID:</strong> {selectedNotice._id}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Posted:</strong> {formatDate(selectedNotice.createdAt || selectedNotice.date)}
                </p>
              </div>

              <button
                className="mt-6 w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Notices;