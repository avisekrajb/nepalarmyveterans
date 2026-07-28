import React, { useState, useEffect } from 'react';
import { introductionAPI } from '../../services/api';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const IntroductionManager = () => {
  const [intro, setIntro] = useState({ title: '', content: '', image: '', publicId: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadIntroduction();
  }, []);

  const loadIntroduction = async () => {
    try {
      const { data } = await introductionAPI.getIntroduction();
      setIntro(data);
    } catch (error) {
      toast.error('Failed to load introduction');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', intro.title);
    formData.append('content', intro.content);
    if (imageFile) formData.append('image', imageFile);

    setSaving(true);
    try {
      const { data } = await introductionAPI.updateIntroduction(formData);
      setIntro(data);
      setImageFile(null);
      toast.success('Introduction updated successfully');
    } catch (error) {
      toast.error('Failed to update introduction');
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-army">Introduction Management</h2>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={intro.title}
              onChange={(e) => setIntro({ ...intro, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={intro.content}
              onChange={(e) => setIntro({ ...intro, content: e.target.value })}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            {intro.image && (
              <div className="mb-2">
                <img src={intro.image} alt="Introduction" className="h-32 w-auto object-cover rounded" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the current one</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-3">Preview</h3>
        <div className="prose max-w-none">
          <h4>{intro.title || 'Title'}</h4>
          <p>{intro.content || 'Content will appear here...'}</p>
        </div>
      </div>
    </div>
  );
};

export default IntroductionManager;