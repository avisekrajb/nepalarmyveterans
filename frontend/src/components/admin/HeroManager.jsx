import React, { useState, useEffect } from 'react';
import { heroAPI } from '../../services/api';
import { Plus, Trash2, Upload, X, Image as ImageIcon, Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroManager = () => {
  const [heroData, setHeroData] = useState({ carouselImages: [], seniors: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState({ titleEn: '', titleNe: '' });
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editTitle, setEditTitle] = useState({ titleEn: '', titleNe: '' });
  const [editTitleSaving, setEditTitleSaving] = useState(false);
  const [newSenior, setNewSenior] = useState({ nameEn: '', nameNe: '', roleEn: '', roleNe: '' });
  const [seniorImageFile, setSeniorImageFile] = useState(null);
  const [seniorImagePreview, setSeniorImagePreview] = useState(null);
  const [showSeniorForm, setShowSeniorForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editSenior, setEditSenior] = useState({ nameEn: '', nameNe: '', roleEn: '', roleNe: '' });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
    formData.append('title', newTitle.titleEn || newTitle.titleNe || '');
    formData.append('titleEn', newTitle.titleEn);
    formData.append('titleNe', newTitle.titleNe);

    setUploading(true);
    try {
      const { data } = await heroAPI.uploadCarouselImage(formData);
      setHeroData(data);
      setNewTitle({ titleEn: '', titleNe: '' });
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

  const startEditTitle = (index) => {
    const img = heroData.carouselImages[index];
    setEditingTitleIndex(index);
    setEditTitle({
      titleEn: img.titleEn || img.title || '',
      titleNe: img.titleNe || '',
    });
  };

  const saveEditTitle = async (index) => {
    setEditTitleSaving(true);
    try {
      const { data } = await heroAPI.updateCarouselImage(index, {
        title: editTitle.titleEn || editTitle.titleNe || '',
        titleEn: editTitle.titleEn,
        titleNe: editTitle.titleNe,
      });
      setHeroData(data);
      setEditingTitleIndex(null);
      toast.success('Title updated');
    } catch (error) {
      toast.error('Failed to update title');
    } finally {
      setEditTitleSaving(false);
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
    
    if (!newSenior.nameEn && !newSenior.nameNe) {
      toast.error('Name (English or Nepali) is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('name', newSenior.nameEn || newSenior.nameNe || '');
      formData.append('nameEn', newSenior.nameEn);
      formData.append('nameNe', newSenior.nameNe);
      formData.append('role', newSenior.roleEn || newSenior.roleNe || '');
      formData.append('roleEn', newSenior.roleEn);
      formData.append('roleNe', newSenior.roleNe);
      
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
    setNewSenior({ nameEn: '', nameNe: '', roleEn: '', roleNe: '' });
    setSeniorImageFile(null);
    setSeniorImagePreview(null);
    setShowSeniorForm(false);
    setIsSubmitting(false);
  };

  const startEditSenior = (index) => {
    const senior = heroData.seniors[index];
    setEditingIndex(index);
    setEditSenior({
      nameEn: senior.nameEn || senior.name || '',
      nameNe: senior.nameNe || '',
      roleEn: senior.roleEn || senior.role || '',
      roleNe: senior.roleNe || '',
    });
    setEditImageFile(null);
    setEditImagePreview(senior.image || null);
    setShowSeniorForm(false);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditSenior({ nameEn: '', nameNe: '', roleEn: '', roleNe: '' });
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSenior.nameEn && !editSenior.nameNe) {
      toast.error('Name (English or Nepali) is required');
      return;
    }
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', editSenior.nameEn || editSenior.nameNe || '');
      formData.append('nameEn', editSenior.nameEn);
      formData.append('nameNe', editSenior.nameNe);
      formData.append('role', editSenior.roleEn || editSenior.roleNe || '');
      formData.append('roleEn', editSenior.roleEn);
      formData.append('roleNe', editSenior.roleNe);
      if (editImageFile) {
        formData.append('image', editImageFile);
      }
      const { data } = await heroAPI.updateSenior(editingIndex, formData);
      setHeroData(data);
      cancelEdit();
      toast.success('Senior updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update senior');
    } finally {
      setIsUpdating(false);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
            <input
              type="text"
              value={newTitle.titleEn}
              onChange={(e) => setNewTitle({ ...newTitle, titleEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter title in English"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (Nepali)</label>
            <input
              type="text"
              value={newTitle.titleNe}
              onChange={(e) => setNewTitle({ ...newTitle, titleNe: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="नेपालीमा शीर्षक"
            />
          </div>
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
              {editingTitleIndex === index ? (
                <div className="p-2 space-y-1.5 bg-white">
                  <p className="text-[10px] text-gray-500 font-medium">Title (EN)</p>
                  <input
                    type="text"
                    value={editTitle.titleEn}
                    onChange={(e) => setEditTitle({ ...editTitle, titleEn: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="English title"
                  />
                  <p className="text-[10px] text-gray-500 font-medium">Title (NE)</p>
                  <input
                    type="text"
                    value={editTitle.titleNe}
                    onChange={(e) => setEditTitle({ ...editTitle, titleNe: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="नेपाली शीर्षक"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEditTitle(index)}
                      disabled={editTitleSaving}
                      className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-[10px] hover:bg-green-700 disabled:opacity-50"
                    >
                      {editTitleSaving ? <span className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></span> : <Save className="h-3 w-3" />}
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTitleIndex(null)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-[10px] hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white px-2 py-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      {img.titleEn || img.titleNe ? (
                        <p className="text-[11px] text-gray-700 font-medium truncate">{img.titleEn || img.title}</p>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">No title</p>
                      )}
                      {img.titleNe && <p className="text-[10px] text-gray-400 truncate">{img.titleNe}</p>}
                    </div>
                    <button
                      onClick={() => startEditTitle(index)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded shrink-0"
                      title="Edit Title"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                <input
                  type="text"
                  value={newSenior.nameEn}
                  onChange={(e) => setNewSenior({ ...newSenior, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter name in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Nepali) *</label>
                <input
                  type="text"
                  value={newSenior.nameNe}
                  onChange={(e) => setNewSenior({ ...newSenior, nameNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="नेपालीमा नाम लेख्नुहोस्"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role (English) *</label>
                <input
                  type="text"
                  value={newSenior.roleEn}
                  onChange={(e) => setNewSenior({ ...newSenior, roleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter role in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role (Nepali) *</label>
                <input
                  type="text"
                  value={newSenior.roleNe}
                  onChange={(e) => setNewSenior({ ...newSenior, roleNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="नेपालीमा पद लेख्नुहोस्"
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
              {editingIndex === index ? (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN)</label>
                      <input
                        type="text"
                        value={editSenior.nameEn}
                        onChange={(e) => setEditSenior({ ...editSenior, nameEn: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name (NE)</label>
                      <input
                        type="text"
                        value={editSenior.nameNe}
                        onChange={(e) => setEditSenior({ ...editSenior, nameNe: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Role (EN)</label>
                      <input
                        type="text"
                        value={editSenior.roleEn}
                        onChange={(e) => setEditSenior({ ...editSenior, roleEn: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Role (NE)</label>
                      <input
                        type="text"
                        value={editSenior.roleNe}
                        onChange={(e) => setEditSenior({ ...editSenior, roleNe: e.target.value })}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-gold focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Photo</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white hover:bg-gray-50 px-3 py-1 rounded border border-gray-300 text-xs flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        {editImageFile ? 'Changed' : 'Update Photo'}
                        <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                      </label>
                      {editImagePreview && (
                        <img src={editImagePreview} alt="Preview" className="h-10 w-10 object-cover rounded border border-gold/30" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {isUpdating ? <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span> : null}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
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
                      <h4 className="font-semibold text-army text-sm">{senior.nameEn || senior.name}</h4>
                      {senior.nameNe && <p className="text-xs text-gray-500">{senior.nameNe}</p>}
                      <p className="text-xs text-gray-500">{senior.roleEn || senior.role}</p>
                      {senior.roleNe && <p className="text-xs text-gray-400">{senior.roleNe}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditSenior(index)}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded"
                      title="Edit Senior"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSenior(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
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