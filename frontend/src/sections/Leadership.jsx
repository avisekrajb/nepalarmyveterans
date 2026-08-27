import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { leadershipAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import { useLanguage } from '../context/LanguageContext';

export function Leadership() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLocalizedField, isNepali } = useLanguage();

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
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <Loader label="Loading Leadership" />
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            {isNepali ? 'केन्द्रीय सञ्चालन समिति' : 'Central Executive Committee'}
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            {isNepali ? 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको नेतृत्व टोली' : 'Leadership Team of Nepal National Ex-Army Association'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {leaders.map((leader, index) => {
            const roleColors = [
              'bg-army text-white',
              'bg-gold text-white',
              'bg-crimson text-white',
              'bg-army-light text-white',
              'bg-gold-dark text-white',
              'bg-army-dark text-white',
              'bg-gold-light text-army',
            ];
            return (
              <div key={leader._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
                <div className="aspect-square overflow-hidden bg-gray-100 relative">
                  <img
                    src={leader.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Leader'}
                    alt={getLocalizedField(leader, 'name') || leader.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Leader';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${roleColors[index % roleColors.length]}`}>
                      {getLocalizedField(leader, 'role') || leader.role}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-army text-sm md:text-base leading-tight">{getLocalizedField(leader, 'name') || leader.name}</h3>
                  {leader.bio && (
                    <p className="text-gray-600 text-xs mt-1.5 line-clamp-2">{getLocalizedField(leader, 'bio') || leader.bio}</p>
                  )}
                </div>
              </div>
            );
          })}
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