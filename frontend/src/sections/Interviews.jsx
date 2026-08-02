import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { interviewAPI } from '../services/api';
import { Mic, Calendar, User, Video, Image, Play, X, ExternalLink, Eye, CalendarDays, Link2 } from 'lucide-react';

const FALLBACK_IMAGE = 'https://placehold.co/600x400/1F3D2B/FFFFFF?text=Interview';

export function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const { data } = await interviewAPI.getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to load interviews:', error);
    } finally {
      setLoading(false);
    }
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

  const getYear = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).getFullYear();
    } catch {
      return 'N/A';
    }
  };

  const hasImage = (item) => {
    return item.image && item.image !== '' && item.image !== null && item.image !== undefined;
  };

  const getThumbnail = (item) => {
    if (hasImage(item)) {
      return item.image;
    }
    if (item.type === 'video' && item.videoUrl) {
      const videoId = extractYouTubeId(item.videoUrl);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    return FALLBACK_IMAGE;
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openVideo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Get unique years for filter
  const years = [...new Set(interviews.map(item => getYear(item.date)))].filter(y => y !== 'N/A').sort((a, b) => b - a);

  const filteredInterviews = activeFilter === 'all' 
    ? interviews 
    : interviews.filter(item => getYear(item.date) === parseInt(activeFilter));

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
           
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Interviews
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Exclusive interviews with our leaders, members, and distinguished guests.
            </p>
          </div>

          {/* Year Filter */}
          {years.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                All Years
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveFilter(year.toString())}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeFilter === year.toString()
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* 4 per row grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredInterviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group cursor-pointer"
                onClick={() => setSelectedInterview(interview)}
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={getThumbnail(interview)}
                    alt={interview.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                  
                  {/* Type Badge - Mini */}
                  <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full text-white ${
                    interview.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {interview.type === 'video' ? 'Video' : 'Photo'}
                  </span>

                  {/* Year Badge - Top Left */}
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {getYear(interview.date)}
                  </span>

                  {/* Play icon overlay for videos */}
                  {interview.type === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 text-gold ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content - Mini */}
                <div className="p-3">
                  <h3 className="font-semibold text-army text-sm line-clamp-1 group-hover:text-gold transition-colors">
                    {interview.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <User className="h-3 w-3 text-gold" />
                    <p className="text-xs text-gray-600 truncate">{interview.guest}</p>
                  </div>
                  
                  {interview.team && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{interview.team}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(interview.date)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {interview.type === 'video' && interview.videoUrl && (
                        <button 
                          className="text-[10px] bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-2 py-0.5 rounded transition-colors flex items-center gap-0.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            openVideo(interview.videoUrl);
                          }}
                        >
                          <Play className="h-3 w-3" />
                          Watch
                        </button>
                      )}
                      <button 
                        className="text-[10px] bg-gold/10 text-gold hover:bg-gold hover:text-white px-2 py-0.5 rounded transition-colors flex items-center gap-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInterview(interview);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <Mic className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No interviews available for this year.</p>
            </div>
          )}
        </div>
      </Container>

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedInterview(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-army">Interview Details</h2>
              <button
                onClick={() => setSelectedInterview(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image/Video Display */}
              {selectedInterview.type === 'video' && selectedInterview.videoUrl ? (
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                  {selectedInterview.videoUrl.includes('youtube.com') || selectedInterview.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={selectedInterview.videoUrl.includes('watch?v=') 
                        ? selectedInterview.videoUrl.replace('watch?v=', 'embed/') 
                        : selectedInterview.videoUrl.includes('youtu.be')
                          ? `https://www.youtube.com/embed/${extractYouTubeId(selectedInterview.videoUrl)}`
                          : selectedInterview.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title={selectedInterview.title}
                    />
                  ) : (
                    <video
                      src={selectedInterview.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              ) : hasImage(selectedInterview) ? (
                <div className="w-full max-h-96 overflow-hidden rounded-lg mb-4">
                  <img
                    src={selectedInterview.image}
                    alt={selectedInterview.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              ) : null}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-army">{selectedInterview.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <User className="h-4 w-4 text-gold" />
                      {selectedInterview.guest}
                    </span>
                    {selectedInterview.team && (
                      <span className="text-sm text-gray-400">| {selectedInterview.team}</span>
                    )}
                    <span className="text-sm text-gray-400">|</span>
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedInterview.date)}
                    </span>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      Year: {getYear(selectedInterview.date)}
                    </span>
                  </div>
                </div>

                {selectedInterview.type === 'video' && selectedInterview.videoUrl && (
                  <button
                    onClick={() => openVideo(selectedInterview.videoUrl)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Play className="h-4 w-4" />
                    Watch Full Video
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="mt-4 prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInterview.content}
                </p>
              </div>

              {selectedInterview.type === 'video' && selectedInterview.videoUrl && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Link2 className="h-3 w-3" />
                    Video Link: 
                    <a 
                      href={selectedInterview.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold-dark truncate max-w-xs"
                    >
                      {selectedInterview.videoUrl}
                    </a>
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedInterview(null)}
                className="mt-6 w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors"
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

export default Interviews;