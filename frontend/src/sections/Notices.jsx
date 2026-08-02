import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { noticesAPI } from '../services/api';
import { Bell, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Skeleton from '../components/skeleton/Skeleton';

export function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedNotices, setExpandedNotices] = useState({});

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setLoading(true);
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
          content: 'The Annual General Meeting of the Nepal National Ex-Army Association will be held on December 15, 2024 at 10:00 AM at the association headquarters. All members are requested to attend. The meeting will cover important agenda items including annual report presentation, financial audit review, and election of new committee members.',
          date: new Date('2024-12-15').toISOString(),
          priority: 'high',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop'
        },
        {
          _id: '2',
          title: 'New Membership Drive',
          content: 'We are excited to announce a new membership drive starting from November 1, 2024. All veterans are encouraged to join and become part of our growing community. Special benefits for early registrations.',
          date: new Date('2024-11-01').toISOString(),
          priority: 'high',
          image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop'
        },
        {
          _id: '3',
          title: 'Health Camp Announcement',
          content: 'A free health camp for veterans and their families will be organized on October 10-12, 2024 at the Kathmandu Medical College. Specialists from various fields will be available for consultation.',
          date: new Date('2024-10-10').toISOString(),
          priority: 'medium',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
        },
        {
          _id: '4',
          title: 'Office Holiday Notice',
          content: 'The association office will remain closed on October 17, 2024 on the occasion of Dashain festival. Normal operations will resume on October 18, 2024.',
          date: new Date('2024-10-17').toISOString(),
          priority: 'low',
          image: ''
        },
        {
          _id: '5',
          title: 'Scholarship Program for Veterans Children',
          content: 'Applications are invited for the scholarship program for children of veterans. The scholarship covers tuition fees and educational materials for deserving students.',
          date: new Date('2024-09-20').toISOString(),
          priority: 'medium',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
        },
        {
          _id: '6',
          title: 'Veterans Day Celebration',
          content: 'Join us in celebrating Veterans Day with special programs and ceremonies. The event will feature speeches, cultural programs, and recognition of veteran contributions.',
          date: new Date('2024-11-11').toISOString(),
          priority: 'high',
          image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop'
        },
        {
          _id: '7',
          title: 'Community Service Program',
          content: 'Volunteer for our community service program helping local communities. Activities include cleaning drives, education programs, and health awareness campaigns.',
          date: new Date('2024-12-01').toISOString(),
          priority: 'low',
          image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=300&fit=crop'
        },
        {
          _id: '8',
          title: 'Leadership Training Workshop',
          content: 'Leadership training workshop for veterans interested in community leadership. The workshop covers team management, communication skills, and community engagement.',
          date: new Date('2024-10-25').toISOString(),
          priority: 'medium',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedNotices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Urgent',
      medium: 'Important',
      low: 'General',
    };
    return labels[priority] || 'General';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const hasImage = (notice) => {
    return notice?.image && notice.image !== '' && notice.image !== null && notice.image !== undefined;
  };

  const filteredNotices = filter === 'all' 
    ? notices 
    : notices.filter(n => n.priority === filter);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="skeleton-shimmer h-10 w-80 rounded-lg mx-auto" />
              <div className="skeleton-shimmer h-6 w-96 rounded-lg mx-auto mt-2" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-shimmer h-10 w-28 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="skeleton-shimmer h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton-shimmer h-3 w-20 rounded-full" />
                    <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                    <div className="space-y-2">
                      <div className="skeleton-shimmer h-3 w-full rounded" />
                      <div className="skeleton-shimmer h-3 w-5/6 rounded" />
                      <div className="skeleton-shimmer h-3 w-4/5 rounded" />
                    </div>
                    <div className="skeleton-shimmer h-4 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army">
              Notices & Updates
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
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
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              All Notices
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'high'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Urgent
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'medium'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'low'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              General
            </button>
          </div>

          {/* Notice Cards Grid - 4 per row - NOT CLICKABLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredNotices.map((notice) => {
              const hasImageValue = hasImage(notice);
              const isExpanded = expandedNotices[notice._id] || false;
              
              return (
                <div
                  key={notice._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                    {hasImageValue ? (
                      <img
                        src={notice.image}
                        alt={notice.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100">
                              <div class="text-center">
                                <svg class="h-10 w-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-xs text-gray-400 mt-1">No Image</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <svg className="h-10 w-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-400 mt-1">No Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Date Badge - Bottom left */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                      {formatDate(notice.date)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Priority Badge */}
                    <div className="mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full text-white ${getPriorityColor(notice.priority)}`}>
                        {getPriorityLabel(notice.priority)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-army text-sm line-clamp-2">
                      {notice.title}
                    </h3>
                    
                    {/* Content with Expand/Collapse */}
                    <div className="mt-2 flex-1">
                      <p className={`text-gray-500 text-xs leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {notice.content}
                      </p>
                    </div>
                    
                    {/* View More / View Less Button - Inside the card */}
                    {notice.content && notice.content.length > 120 && (
                      <button
                        onClick={() => toggleExpand(notice._id)}
                        className="mt-3 flex items-center gap-1 text-gold text-xs font-medium hover:text-gold-dark transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            View More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredNotices.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notices available for this filter.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Notices;