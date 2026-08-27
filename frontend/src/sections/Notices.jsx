import React, { useState, useEffect } from 'react';
import Loader from '../components/ui/Loader';
import { Container } from '../components/ui/Section';
import { noticesAPI } from '../services/api';
import { Bell, Calendar, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { getLocalizedField } = useLanguage();

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data } = await noticesAPI.getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedNotice(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <Loader label="Loading Notices" />
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

          {/* Notice Cards Grid - click opens mini modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredNotices.map((notice) => {
              const hasImageValue = hasImage(notice);

              return (
                <button
                  key={notice._id}
                  onClick={() => setSelectedNotice(notice)}
                  className="group text-left bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gold/50 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100 flex-shrink-0">
                    {hasImageValue ? (
                      <img
                        src={notice.image}
                        alt={getLocalizedField(notice, 'title') || notice.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100">
                              <p class="text-xs text-gray-400">No Image</p>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Bell className="h-8 w-8 text-gray-300" />
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

                    <h3 className="font-semibold text-army text-sm line-clamp-2 group-hover:text-gold-dark transition-colors">
                      {getLocalizedField(notice, 'title') || notice.title}
                    </h3>

                    <p className="mt-2 flex-1 text-gray-500 text-xs leading-relaxed line-clamp-3">
                      {getLocalizedField(notice, 'content') || notice.content}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1 text-gold text-xs font-semibold">
                      View Details
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </button>
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

      {/* Notice detail modal - mini size with full photo */}
      {selectedNotice && (
        <div
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Full photo */}
            <div className="h-52 shrink-0 bg-gray-100">
              {hasImage(selectedNotice) ? (
                <img
                  src={selectedNotice.image}
                  alt={getLocalizedField(selectedNotice, 'title') || selectedNotice.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-army/5">
                  <Bell className="h-10 w-10 text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="overflow-y-auto p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full text-white ${getPriorityColor(selectedNotice.priority)}`}>
                  {getPriorityLabel(selectedNotice.priority)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  {formatDate(selectedNotice.date)}
                </span>
              </div>

              <h2 className="font-display text-lg font-bold text-army mt-3 pr-6">
                {getLocalizedField(selectedNotice, 'title') || selectedNotice.title}
              </h2>

              <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {getLocalizedField(selectedNotice, 'content') || selectedNotice.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Notices;
