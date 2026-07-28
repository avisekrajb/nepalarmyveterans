import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../services/api';
import { Image, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CloudinaryManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data } = await superAdminAPI.getCloudinaryImages();
      setImages(data);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId) => {
    if (!window.confirm('Delete this image permanently?')) return;
    try {
      await superAdminAPI.deleteCloudinaryImage(publicId);
      toast.success('Image deleted successfully');
      loadImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const filteredImages = images.filter(img =>
    img.public_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.format?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-army">Cloudinary Manager</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <span className="text-sm text-gray-500">{images.length} images</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.public_id}
            className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              className="aspect-square cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.secure_url}
                alt={img.public_id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">Click to preview</span>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-500 truncate">{img.public_id?.split('/').pop()}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">{img.format}</span>
                <button
                  onClick={() => deleteImage(img.public_id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images found</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage.secure_url}
              alt={selectedImage.public_id}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-2 text-white text-sm">
              <p>Public ID: {selectedImage.public_id}</p>
              <p>Format: {selectedImage.format}</p>
              <p>Size: {(selectedImage.bytes / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryManager;