import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { newsAPI } from '../services/api';
import { Mic, Calendar } from 'lucide-react';

export function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      // You can create a separate API endpoint for interviews
      // or use news API with a filter
      const { data } = await newsAPI.getNews();
      // Filter or map as needed
      setInterviews(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load interviews:', error);
      // Fallback data
      setInterviews([
        {
          _id: '1',
          title: 'A Conversation with Gen. Rajendra Chhetri',
          content: 'Discussing the future of veterans organizations in Nepal...',
          date: new Date('2024-01-20').toISOString()
        },
        {
          _id: '2',
          title: 'Women Veterans: Breaking Barriers',
          content: 'The journey and achievements of women in the army...',
          date: new Date('2024-01-18').toISOString()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Media</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Interviews
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Exclusive interviews with our leaders and members.
            </p>
          </div>

          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-gold/10 p-3 rounded-full flex-shrink-0">
                    <Mic className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">{interview.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(interview.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{interview.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {interviews.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Mic className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No interviews available at the moment.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Interviews;