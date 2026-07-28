import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { introductionAPI } from '../services/api';

export function Introduction() {
  const [intro, setIntro] = useState({ title: 'Introduction', content: '', image: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntroduction();
  }, []);

  const loadIntroduction = async () => {
    try {
      const { data } = await introductionAPI.getIntroduction();
      setIntro(data);
    } catch (error) {
      console.error('Failed to load introduction:', error);
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
        <div className="max-w-4xl mx-auto">
          <Eyebrow>About Us</Eyebrow>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4 mb-8">
            {intro.title || 'Introduction'}
          </h1>

          {intro.image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img src={intro.image} alt="Introduction" className="w-full h-64 md:h-96 object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {intro.content ? (
              <div dangerouslySetInnerHTML={{ __html: intro.content.replace(/\n/g, '<br />') }} />
            ) : (
              <p>
                The Nepal National Ex-Army Association is a premier organization dedicated to the welfare
                and unity of retired army personnel. Established with the vision of serving the nation
                beyond active service, our association brings together veterans who have dedicated their
                lives to protecting Nepal's sovereignty and territorial integrity.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Introduction;