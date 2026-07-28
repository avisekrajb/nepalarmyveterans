import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { centralCommitteeAPI } from '../services/api';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';

export function CentralCommittee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const initialDisplay = 8;

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data } = await centralCommitteeAPI.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load committee members:', error);
      // Fallback data
      setMembers([
        {
          _id: '1',
          name: 'Dr. Keshab Bahadur Bhandari',
          role: 'President',
          bio: 'Leading the association with vision and dedication.',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop'
        },
        {
          _id: '2',
          name: 'Ram Chandra Thapa',
          role: 'Vice President',
          bio: 'Dedicated to veteran welfare and social service.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
        },
        {
          _id: '3',
          name: 'Krishna Bahadur Shahi',
          role: 'General Secretary',
          bio: 'Managing day-to-day operations and administration.',
          image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop'
        },
        {
          _id: '4',
          name: 'Hanuman Prasad Bhattarai',
          role: 'Treasurer',
          bio: 'Managing financial resources and planning.',
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop'
        },
        {
          _id: '5',
          name: 'Gopal Shrestha',
          role: 'Joint Secretary',
          bio: 'Supporting secretarial functions and coordination.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
        },
        {
          _id: '6',
          name: 'Bhim Bahadur Karki',
          role: 'Member',
          bio: 'Contributing to policy and strategic decisions.',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
        },
        {
          _id: '7',
          name: 'Sita Sharma',
          role: 'Member',
          bio: 'Focusing on women veterans and social welfare.',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
        },
        {
          _id: '8',
          name: 'Ramesh Adhikari',
          role: 'Member',
          bio: 'Active in community outreach and programs.',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const displayedMembers = showAll ? members : members.slice(0, initialDisplay);

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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Leadership</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Central Executive Committee
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Meet the dedicated leaders guiding our association towards excellence and service.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedMembers.map((member) => (
              <div 
                key={member._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo';
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-army text-sm truncate">{member.name}</h3>
                  <p className="text-xs text-gold-dark font-medium truncate">{member.role}</p>
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {members.length > initialDisplay && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    View All ({members.length})
                  </>
                )}
              </button>
            </div>
          )}

          {members.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No committee members available.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default CentralCommittee;