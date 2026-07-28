import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { eventsAPI } from '../services/api';
import { Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react';

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
          description: 'Celebrating the bravery and sacrifice of our army personnel. Special ceremonies and cultural programs.',
          date: new Date('2024-11-20').toISOString(),
          location: 'Army Headquarters, Kathmandu',
          image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=400&fit=crop'
        },
        {
          _id: '3',
          title: 'Veterans Health Camp',
          description: 'Free health checkup camp for veterans and their families. Specialists available for consultation.',
          date: new Date('2024-10-10').toISOString(),
          location: 'Kathmandu, Nepal',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
        },
        {
          _id: '4',
          title: 'International Veterans Conference',
          description: 'Global conference bringing together veterans organizations from around the world to share experiences and best practices.',
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
        month: 'long',
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
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Upcoming & Past Events</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Events & Activities
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Join us at our upcoming events and activities. Stay connected with the veteran community.
            </p>
          </div>

          {/* Upcoming Events */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-army mb-6 flex items-center gap-2">
              <span className="bg-green-500 w-3 h-3 rounded-full"></span>
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.filter(e => isUpcoming(e.date)).map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  formatDate={formatDate}
                  onView={() => setSelectedEvent(event)}
                />
              ))}
              {events.filter(e => isUpcoming(e.date)).length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming events scheduled at the moment.</p>
                  <p className="text-sm text-gray-400 mt-1">Check back later for updates.</p>
                </div>
              )}
            </div>
          </div>

          {/* Past Events */}
          <div>
            <h2 className="font-display text-2xl font-bold text-army mb-6 flex items-center gap-2">
              <span className="bg-gray-400 w-3 h-3 rounded-full"></span>
              Past Events
            </h2>
            <div className="space-y-4">
              {events.filter(e => !isUpcoming(e.date)).map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  formatDate={formatDate}
                  onView={() => setSelectedEvent(event)}
                  past
                />
              ))}
              {events.filter(e => !isUpcoming(e.date)).length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No past events available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          formatDate={formatDate}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}

// Event Card Component
const EventCard = ({ event, formatDate, onView, past = false }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border ${
      past ? 'border-gray-200 opacity-75 hover:opacity-100' : 'border-gold/30 hover:border-gold/60'
    } cursor-pointer`}
    onClick={onView}
  >
    <div className="md:flex">
      {event.image && (
        <div className="md:w-48 md:flex-shrink-0 h-48 md:h-auto overflow-hidden bg-gray-100">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300/1F3D2B/FFFFFF?text=Event';
            }}
          />
        </div>
      )}
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`font-display text-xl font-bold ${past ? 'text-gray-600' : 'text-army'}`}>
              {event.title}
            </h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
              {event.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.date)}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
          {past ? (
            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">Past</span>
          ) : (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Upcoming</span>
          )}
        </div>
        {event.description && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">{event.description}</p>
        )}
        <button 
          className="mt-3 text-gold hover:text-gold-dark text-sm font-medium transition-colors"
          onClick={(e) => { e.stopPropagation(); onView(); }}
        >
          View Details →
        </button>
      </div>
    </div>
  </div>
);

// Event Modal Component
const EventModal = ({ event, formatDate, onClose }) => (
  <div 
    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {event.image && (
        <div className="w-full h-64 overflow-hidden rounded-t-2xl">
          <img 
            src={event.image} 
            alt={event.title} 
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
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="font-display text-2xl font-bold text-army">{event.title}</h2>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
          {event.date && (
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              {formatDate(event.date)}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {event.location}
            </span>
          )}
        </div>
        {event.description && (
          <div className="mt-4 prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}
        <button 
          className="mt-6 w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default Events;