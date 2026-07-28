import React, { useState, useEffect } from 'react';
import { heroAPI } from '../../services/api';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroManager = () => {
  const [heroData, setHeroData] = useState({ carouselImages: [], seniors: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newSenior, setNewSenior] = useState({ name: '', role: '', image: '', publicId: '' });
  const [showSeniorForm, setShowSeniorForm] = useState(false);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      const { data } = await heroAPI.getHero();
      setHeroData(data);
    } catch (error) {
      toast.error('Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleCarouselUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await heroAPI.uploadCarouselImage(formData);
      setHeroData(data);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const deleteCarouselImage = async (index) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const { data } = await heroAPI.deleteCarouselImage(index);
      setHeroData(data);
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSeniorSubmit = async (e) => {
    e.preventDefault();
    if (!newSenior.name || !newSenior.role) {
      toast.error('Name and role are required');
      return;
    }

    try {
      const { data } = await heroAPI.addSenior(newSenior);
      setHeroData(data);
      setNewSenior({ name: '', role: '', image: '', publicId: '' });
      setShowSeniorForm(false);
      toast.success('Senior added successfully');
    } catch (error) {
      toast.error('Failed to add senior');
    }
  };

  const deleteSenior = async (index) => {
    if (!window.confirm('Delete this senior?')) return;
    try {
      const { data } = await heroAPI.deleteSenior(index);
      setHeroData(data);
      toast.success('Senior deleted');
    } catch (error) {
      toast.error('Failed to delete senior');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-army">Hero Banner Management</h2>
      </div>

      {/* Carousel Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-army">Carousel Images ({heroData.carouselImages?.length || 0}/20)</h3>
          <label className="cursor-pointer bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleCarouselUpload}
              className="hidden"
              disabled={uploading || heroData.carouselImages?.length >= 20}
            />
          </label>
        </div>

        {uploading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {heroData.carouselImages?.map((img, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <img src={img.url} alt={`Slide ${index + 1}`} className="w-full h-32 object-cover" />
              <button
                onClick={() => deleteCarouselImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        {(!heroData.carouselImages || heroData.carouselImages.length === 0) && (
          <p className="text-center text-gray-500 py-8">No carousel images uploaded yet</p>
        )}
      </div>

      {/* Seniors Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-army">Seniors</h3>
          <button
            onClick={() => setShowSeniorForm(!showSeniorForm)}
            className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Senior
          </button>
        </div>

        {showSeniorForm && (
          <form onSubmit={handleSeniorSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newSenior.name}
                  onChange={(e) => setNewSenior({ ...newSenior, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  value={newSenior.role}
                  onChange={(e) => setNewSenior({ ...newSenior, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={newSenior.image}
                onChange={(e) => setNewSenior({ ...newSenior, image: e.target.value })}
                placeholder="Enter image URL or upload via Cloudinary"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Upload image to Cloudinary first and paste the URL here
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Add Senior
              </button>
              <button
                type="button"
                onClick={() => setShowSeniorForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroData.seniors?.map((senior, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {senior.image && (
                    <img src={senior.image} alt={senior.name} className="w-12 h-12 rounded-full object-cover" />
                  )}
                  <div>
                    <h4 className="font-semibold text-army">{senior.name}</h4>
                    <p className="text-sm text-gray-500">{senior.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteSenior(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!heroData.seniors || heroData.seniors.length === 0) && (
          <p className="text-center text-gray-500 py-4">No seniors added yet</p>
        )}
      </div>
    </div>
  );
};

export default HeroManager;