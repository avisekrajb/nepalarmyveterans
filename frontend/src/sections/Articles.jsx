import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { newsAPI } from '../services/api';
import { FileText, Calendar } from 'lucide-react';

export function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      // Using news API as articles (filtering or using same endpoint)
      const { data } = await newsAPI.getNews();
      // You can filter or map as needed
      setArticles(data.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Failed to load articles:', error);
      // Fallback data
      setArticles([
        {
          _id: '1',
          title: 'The Role of Veterans in Nation Building',
          content: 'Exploring the contributions of ex-army personnel to national development...',
          date: new Date('2024-01-15').toISOString()
        },
        {
          _id: '2',
          title: 'Unity and Brotherhood: The Army Way',
          content: 'How the principles of military service strengthen community bonds...',
          date: new Date('2024-01-10').toISOString()
        },
        {
          _id: '3',
          title: 'Disaster Management: Lessons from the Field',
          content: 'Applying military expertise to disaster response and management...',
          date: new Date('2024-01-05').toISOString()
        },
      ]);
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Publications</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Articles
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Thought-provoking articles from our leadership and members.
            </p>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article._id} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="bg-army/10 p-2 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-army" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">{article.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{article.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No articles available at the moment.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default Articles;