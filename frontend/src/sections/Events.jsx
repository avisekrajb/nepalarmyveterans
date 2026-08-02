import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { eventsAPI } from '../services/api';
import { Calendar, MapPin, Clock, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
          description: 'Join us for the annual gathering of veterans from all over Nepal. A day of remembrance, camaraderie, and celebration.',
          date: new Date('2024-12-15').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop'
        },
        {
          _id: '2',
          title: 'Nepal Army Day Celebration',
          description: 'Celebrating the bravery and sacrifice of our army personnel.',
          date: new Date('2024-11-20').toISOString(),
          location: 'Army Headquarters, Kathmandu',
          image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=400&fit=crop'
        },
        {
          _id: '3',
          title: 'Veterans Health Camp',
          description: 'Free health checkup camp for veterans and their families.',
          date: new Date('2024-10-10').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
        },
        {
          _id: '4',
          title: 'International Veterans Conference',
          description: 'Global conference bringing together veterans organizations from around the world.',
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

  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) > new Date();
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army">
              Events
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Join us at our upcoming events and activities
            </p>
          </div>

          {/* Events Grid - 4 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {events.map((event) => {
              const upcoming = isUpcoming(event.date);
              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.image || 'https://placehold.co/400x200/1F3D2B/FFFFFF?text=Event'}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x200/1F3D2B/FFFFFF?text=Event';
                      }}
                    />
                    {upcoming && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Upcoming
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-[10px] font-medium truncate">{event.title}</p>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-army text-sm truncate">{event.title}</h3>
                    <p className="text-gray-500 text-[10px] mt-1 line-clamp-2">{event.description}</p>
                    
                    <div className="mt-2 space-y-1">
                      {event.date && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Calendar className="h-3 w-3 text-gold" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <MapPin className="h-3 w-3 text-gold" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <button className="mt-2 text-gold hover:text-gold-dark text-[10px] font-medium flex items-center gap-1 transition-colors">
                      View Details <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No events available</p>
            </div>
          )}
        </div>
      </Container>

      {/* Event Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedEvent.image && (
              <div className="w-full h-56 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/800x400/1F3D2B/FFFFFF?text=Event';
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <button
                className="float-right text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
              <h2 className="font-display text-2xl font-bold text-army">{selectedEvent.title}</h2>
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                {selectedEvent.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gold" />
                    {formatDate(selectedEvent.date)}
                  </span>
                )}
                {selectedEvent.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" />
                    {selectedEvent.location}
                  </span>
                )}
              </div>
              {selectedEvent.description && (
                <div className="mt-4">
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>
              )}
              <button
                className="mt-6 w-full bg-gold text-white py-2.5 rounded-lg hover:bg-gold-dark transition-colors"
                onClick={() => setSelectedEvent(null)}
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

export default Events;