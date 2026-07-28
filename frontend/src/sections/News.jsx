import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { newsAPI } from '../services/api';
import { Calendar } from 'lucide-react';

export function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data } = await newsAPI.getNews();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Eyebrow>Updates</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            Latest News
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Stay updated with the latest happenings and announcements.
          </p>
        </div>

        <div className="space-y-6">
          {news.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
              <div className="md:flex">
                {item.image && (
                  <div className="md:w-64 md:flex-shrink-0 h-48 md:h-auto overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h2 className="font-display text-xl font-bold text-army">{item.title}</h2>
                  <p className="text-gray-600 mt-2 leading-relaxed">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No news available at the moment.</p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default News;