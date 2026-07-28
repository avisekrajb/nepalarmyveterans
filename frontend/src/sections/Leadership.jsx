import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { leadershipAPI } from '../services/api';

export function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      const { data } = await leadershipAPI.getLeadership();
      setLeaders(data);
    } catch (error) {
      console.error('Failed to load leadership:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Eyebrow>Our Team</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            Leadership Team
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Meet the dedicated individuals leading our organization towards success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <div key={leader._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={leader.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Leader'}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-army text-lg">{leader.name}</h3>
                <p className="text-sm text-gold-dark font-medium">{leader.role}</p>
                {leader.bio && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{leader.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {leaders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No leadership data available.</p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default Leadership;