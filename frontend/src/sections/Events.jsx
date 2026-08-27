import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/ui/Loader';
import { Container } from '../components/ui/Section';
import { eventsAPI } from '../services/api';
import { 
  Calendar, MapPin, Clock, ChevronRight, Calendar as CalendarIcon, 
  ChevronDown, ChevronUp, Users, User, Eye, EyeOff 
} from 'lucide-react';

export function Events() {
  const { t } = useTranslation();
  const { getLocalizedField } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await eventsAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback data
      setEvents([
        {
          _id: '1',
          title: 'Annual Veterans Gathering 2024',
          description: 'Join us for the annual gathering of veterans from all over Nepal. A day of remembrance, camaraderie, and celebration. This event brings together veterans from all branches of the military to share stories, reconnect with old friends, and honor those who have served. The day will include speeches from distinguished guests, cultural performances, and a special tribute to fallen heroes.',
          date: new Date('2024-12-15').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop'
        },
        {
          _id: '2',
          title: 'Nepal Army Day Celebration',
          description: 'Celebrating the bravery and sacrifice of our army personnel. A grand ceremony honoring the valor and dedication of the Nepal Army. The event features a military parade, cultural performances, and a commemorative program highlighting the achievements of the army throughout history.',
          date: new Date('2024-11-20').toISOString(),
          location: 'Army Headquarters, Kathmandu',
          image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=400&fit=crop'
        },
        {
          _id: '3',
          title: 'Veterans Health Camp',
          description: 'Free health checkup camp for veterans and their families. Comprehensive medical services including general checkups, dental care, eye examinations, and specialized consultations. Free medicines and health education materials will also be provided.',
          date: new Date('2024-10-10').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
        },
        {
          _id: '4',
          title: 'International Veterans Conference',
          description: 'Global conference bringing together veterans organizations from around the world. Discussions on veteran welfare, policy reforms, and international cooperation. The conference aims to foster global solidarity and share best practices in veteran support and rehabilitation.',
          date: new Date('2024-09-25').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
        },
      ]);
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

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) > new Date();
    } catch {
      return false;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <Loader label={t('sections.loadingEvents')} />
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-army">
              {t('sections.events')}
            </h1>
            <p className="text-gray-500 mt-3 text-base">
              {t('sections.joinEvents')}
            </p>
          </div>

          {/* Events List - Expandable Cards */}
          <div className="space-y-4">
            {events.map((event) => {
              const isExpanded = expandedId === event._id;
              const upcoming = isUpcoming(event.date);
              
              return (
                <div
                  key={event._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  {/* Card Header - Always visible - Clickable */}
                  <div 
                    className="flex items-start gap-4 p-5 cursor-pointer hover:bg-gray-50/80 transition-colors"
                    onClick={() => toggleExpand(event._id)}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <img
                        src={event.image || 'https://placehold.co/400x200/1F3D2B/FFFFFF?text=Event'}
                        alt={getLocalizedField(event, 'title') || event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x200/1F3D2B/FFFFFF?text=Event';
                        }}
                      />
                      {upcoming && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-md">
                          Upcoming
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-army text-lg hover:text-gold transition-colors">
                            {getLocalizedField(event, 'title') || event.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            {event.date && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 text-gold" />
                                {formatDate(event.date)}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 text-gold" />
                                <span className="truncate max-w-[150px]">{getLocalizedField(event, 'location') || event.location}</span>
                              </span>
                            )}
                          </div>
                          {/* Description preview - truncated */}
                           <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {getLocalizedField(event, 'description') || event.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* See More / See Less Button */}
                          <button 
                            className="text-gold hover:text-gold-dark text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gold/10 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(event._id);
                            }}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                See Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                See More
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/30 animate-fadeIn">
                      <div className="space-y-4">
                        {/* Full Description - NO DUPLICATE IMAGE */}
                        <div>
                          <p className="text-gray-700 leading-relaxed text-base">
                            {getLocalizedField(event, 'description') || event.description}
                          </p>
                        </div>

                        {/* Event Details - Enhanced */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-200">
                          {event.date && (
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gold" />
                              <span className="font-medium">{formatFullDate(event.date)}</span>
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gold" />
                              <span className="font-medium">{getLocalizedField(event, 'location') || event.location}</span>
                            </span>
                          )}
                          {upcoming && (
                            <span className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                              <Clock className="h-3 w-3" />
                              Upcoming Event
                            </span>
                          )}
                          {!upcoming && event.date && (
                            <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                              <Clock className="h-3 w-3" />
                              Past Event
                            </span>
                          )}
                        </div>

                        {/* Organizer if available */}
                        {event.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <User className="h-4 w-4 text-gold" />
                            <span className="font-medium">Organized by:</span>
                            <span>{event.organizer}</span>
                          </div>
                        )}

                        {/* See Less button at bottom */}
                        <button
                          onClick={() => toggleExpand(event._id)}
                          className="mt-2 text-gold hover:text-gold-dark text-sm font-medium flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-gold/10 transition-colors border border-gold/20 hover:border-gold/40"
                        >
                          <ChevronUp className="h-4 w-4" />
                          See Less
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">{t('sections.noEventsAvailable')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('sections.checkBackLater')}</p>
            </div>
          )}
        </div>
      </Container>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

export default Events;