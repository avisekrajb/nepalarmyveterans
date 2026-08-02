import React, { useState, useEffect } from 'react';
import { heroAPI } from '../../services/api';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroManager = () => {
  const [heroData, setHeroData] = useState({ carouselImages: [], seniors: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newSenior, setNewSenior] = useState({ name: '', role: '' });
  const [seniorImageFile, setSeniorImageFile] = useState(null);
  const [seniorImagePreview, setSeniorImagePreview] = useState(null);
  const [showSeniorForm, setShowSeniorForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSeniorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setSeniorImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeniorImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSeniorSubmit = async (e) => {
    e.preventDefault();
    
    if (!newSenior.name || !newSenior.role) {
      toast.error('Name and role are required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newSenior.name);
      formData.append('role', newSenior.role);
      
      if (seniorImageFile) {
        formData.append('image', seniorImageFile);
        console.log('Image file attached:', seniorImageFile.name, seniorImageFile.size);
      } else {
        console.log('No image file attached');
      }

      // Log FormData contents for debugging
      console.log('Submitting senior with FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const { data } = await heroAPI.addSenior(formData);
      setHeroData(data);
      resetSeniorForm();
      toast.success('Senior added successfully');
    } catch (error) {
      console.error('Submit error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add senior');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSeniorForm = () => {
    setNewSenior({ name: '', role: '' });
    setSeniorImageFile(null);
    setSeniorImagePreview(null);
    setShowSeniorForm(false);
    setIsSubmitting(false);
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
        <div>
          <h2 className="text-2xl font-bold text-army">Hero Banner Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage carousel images and senior members</p>
        </div>
      </div>

      {/* Carousel Images */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-army">Carousel Images</h3>
            <p className="text-sm text-gray-500">{heroData.carouselImages?.length || 0} / 20 images</p>
          </div>
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
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>

        {(!heroData.carouselImages || heroData.carouselImages.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No carousel images uploaded yet</p>
            <p className="text-sm text-gray-400">Upload images to display in the hero carousel</p>
          </div>
        )}
      </div>

      {/* Seniors Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-army">Seniors</h3>
            <p className="text-sm text-gray-500">{heroData.seniors?.length || 0} seniors added</p>
          </div>
          <button
            onClick={() => setShowSeniorForm(!showSeniorForm)}
            className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Senior
          </button>
        </div>

        {showSeniorForm && (
          <form onSubmit={handleSeniorSubmit} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newSenior.name}
                  onChange={(e) => setNewSenior({ ...newSenior, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter full name"
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
                  placeholder="Enter role/position"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Upload from device)</label>
              <div className="flex items-center gap-4 flex-wrap">
                <label className={`cursor-pointer bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-gray-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="h-4 w-4 text-gray-600" />
                  {seniorImageFile ? 'Change Image' : 'Choose Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSeniorImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                {seniorImagePreview && (
                  <div className="relative">
                    <img 
                      src={seniorImagePreview} 
                      alt="Senior Preview" 
                      className="h-16 w-16 object-cover rounded-lg border-2 border-gold/30" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSeniorImagePreview(null);
                        setSeniorImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload photo from device (Max 2MB, JPG/PNG/GIF)</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Senior
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetSeniorForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroData.seniors?.map((senior, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {senior.image ? (
                    <img 
                      src={senior.image} 
                      alt={senior.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gold/30" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-army text-sm">{senior.name}</h4>
                    <p className="text-xs text-gray-500">{senior.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteSenior(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!heroData.seniors || heroData.seniors.length === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No seniors added yet</p>
            <p className="text-sm text-gray-400">Click "Add Senior" to add a senior member</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroManager;