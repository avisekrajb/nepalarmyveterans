import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../components/ui/Section';
import { newsAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import { FileText, Calendar, X, Image as ImageIcon } from 'lucide-react';

export function Articles() {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      // Articles are managed by admin via the News manager
      const { data } = await newsAPI.getNews();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles([]);
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

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedArticle(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center">
        <Loader label={t('sections.loadingArticles')} />
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {t('sections.articles')}
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              {t('sections.articlesSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {articles.map((article) => (
              <button
                key={article._id}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-left bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 hover:border-gold/50 group"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 grid place-items-center">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText className="h-6 w-6 text-army" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-army line-clamp-1 group-hover:text-gold-dark transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.date)}
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{article.content}</p>
                    <span className="mt-2 inline-block text-xs font-semibold text-gold-dark">
                      {t('sections.readFullArticle')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>{t('sections.noArticlesAvailable')}</p>
            </div>
          )}
        </div>
      </Container>

      {/* Article detail modal - mini size */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[9997] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Image */}
            <div className="h-44 shrink-0 bg-gray-100">
              {selectedArticle.image ? (
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-army/5">
                  <ImageIcon className="h-10 w-10 text-gray-300" />
                </div>
              )}
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-5">
              <h2 className="font-display text-xl font-bold text-army pr-8">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <Calendar className="h-3 w-3" />
                {formatDate(selectedArticle.date)}
              </div>
              <p className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Articles;
