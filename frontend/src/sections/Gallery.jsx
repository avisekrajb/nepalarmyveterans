import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { galleryAPI } from '../services/api';
import { Image as ImageIcon, X, Grid, LayoutGrid } from 'lucide-react';

export function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const { data } = await galleryAPI.getGallery();
      // Filter only images (no videos)
      const images = data.filter(item => item.type !== 'video');
      setItems(images);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      // Fallback data
      setItems([
        {
          _id: '1',
          title: 'Annual Convention 2024',
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '2',
          title: 'Veterans Day Celebration',
          url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '3',
          title: 'Community Service Program',
          url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '4',
          title: 'Leadership Summit',
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '5',
          title: 'Health Camp 2024',
          url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '6',
          title: 'Unity Walk',
          url: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '7',
          title: 'Awards Ceremony',
          url: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=800&h=600&fit=crop',
          type: 'image'
        },
        {
          _id: '8',
          title: 'Training Program',
          url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
          type: 'image'
        },
      ]);
    } finally {
      setLoading(false);
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Media</Eyebrow>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              Photo Gallery
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Explore our collection of memorable moments and events.
            </p>
          </div>

          {/* View Controls */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gold text-white' : 'hover:bg-gray-100'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.url}
                  alt={item.title || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/600x600/1F3D2B/FFFFFF?text=Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <p className="text-white text-sm font-medium truncate">{item.title || 'Untitled'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No gallery images available.</p>
            </div>
          )}
        </div>
      </Container>

      {/* Lightbox */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors text-2xl"
              onClick={() => setSelectedItem(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedItem.url}
              alt={selectedItem.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x600/1F3D2B/FFFFFF?text=Image';
              }}
            />
            {selectedItem.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                <p className="text-white text-center font-medium">{selectedItem.title}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;