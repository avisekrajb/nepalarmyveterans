import React, { useState, useEffect } from 'react';
import { Container } from '../components/ui/Section';
import { galleryAPI } from '../services/api';
import { Image, Video, X, Grid, LayoutGrid, Play, Calendar } from 'lucide-react';

export function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('photos');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const { data } = await galleryAPI.getGallery();
      setItems(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      // Fallback data
      setItems([
        { _id: '1', title: 'Annual Convention 2024', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop', type: 'image' },
        { _id: '2', title: 'Veterans Day Celebration', url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop', type: 'image' },
        { _id: '3', title: 'Community Service Program', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop', type: 'image' },
        { _id: '4', title: 'Leadership Summit', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', type: 'image' },
        { _id: '5', title: 'Health Camp 2024', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=600&fit=crop', type: 'image' },
        { _id: '6', title: 'Unity Walk', url: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&h=600&fit=crop', type: 'image' },
        { _id: '7', title: 'Awards Ceremony', url: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=800&h=600&fit=crop', type: 'image' },
        { _id: '8', title: 'Training Program', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', type: 'image' },
        // Videos
        { _id: '9', title: 'Annual Event Highlights', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video' },
        { _id: '10', title: 'Veterans Day Speech', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', type: 'video' },
        { _id: '11', title: 'Community Service Video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', type: 'video' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const photos = items.filter(item => item.type !== 'video');
  const videos = items.filter(item => item.type === 'video');

  const displayedItems = activeTab === 'photos' ? photos : videos;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army">
              Gallery
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Explore our collection of memorable moments and events
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full shadow-sm border border-gray-200 p-1 flex gap-1">
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'photos'
                    ? 'bg-gold text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Image className="h-4 w-4" />
                Photos ({photos.length})
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'videos'
                    ? 'bg-gold text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Video className="h-4 w-4" />
                Videos ({videos.length})
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedItems.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-gray-900 relative">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-army ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate">{item.title || 'Untitled'}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.url}
                      alt={item.title || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/600x600/1F3D2B/FFFFFF?text=Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <p className="text-white text-xs font-medium truncate">{item.title || 'Untitled'}</p>
                      </div>
                    </div>
                  </>
                )}
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video
                  </div>
                )}
              </div>
            ))}
          </div>

          {displayedItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {activeTab === 'photos' ? (
                  <Image className="h-8 w-8 text-gray-400" />
                ) : (
                  <Video className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="text-gray-500">No {activeTab} available</p>
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
            {selectedItem.type === 'video' ? (
              <video
                src={selectedItem.url}
                controls
                className="w-full h-auto max-h-[80vh] rounded-lg"
                autoPlay
              />
            ) : (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x600/1F3D2B/FFFFFF?text=Image';
                }}
              />
            )}
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