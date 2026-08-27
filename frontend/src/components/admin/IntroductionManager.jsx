import React, { useState, useEffect } from 'react';
import { introductionAPI } from '../../services/api';
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const IntroductionManager = () => {
  const [intro, setIntro] = useState({ 
    titleEn: '', 
    titleNe: '', 
    contentEn: '', 
    contentNe: '', 
    image: '', 
    publicId: '' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLang, setFormLang] = useState('en');

  useEffect(() => {
    loadIntroduction();
  }, []);

  const loadIntroduction = async () => {
    try {
      const { data } = await introductionAPI.getIntroduction();
      setIntro({
        titleEn: data.titleEn || data.title || '',
        titleNe: data.titleNe || '',
        contentEn: data.contentEn || data.content || '',
        contentNe: data.contentNe || '',
        image: data.image || '',
        publicId: data.publicId || '',
      });
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      toast.error('Failed to load introduction');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', intro.titleEn || '');
    formData.append('titleEn', intro.titleEn);
    formData.append('titleNe', intro.titleNe);
    formData.append('content', intro.contentEn || '');
    formData.append('contentEn', intro.contentEn);
    formData.append('contentNe', intro.contentNe);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setSaving(true);
    try {
      const { data } = await introductionAPI.updateIntroduction(formData);
      setIntro({
        titleEn: data.titleEn || data.title || '',
        titleNe: data.titleNe || '',
        contentEn: data.contentEn || data.content || '',
        contentNe: data.contentNe || '',
        image: data.image || '',
        publicId: data.publicId || '',
      });
      setImageFile(null);
      toast.success('Introduction updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update introduction');
    } finally {
      setSaving(false);
    }
  };

  const LangTabs = () => (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      <button
        type="button"
        onClick={() => setFormLang('en')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          formLang === 'en' ? 'bg-white text-army shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setFormLang('ne')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          formLang === 'ne' ? 'bg-white text-army shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        NE
      </button>
    </div>
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
        <div>
          <h2 className="text-2xl font-bold text-army">Introduction Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the introduction page content and image</p>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full">
          <span className="text-xs text-green-600 font-medium">● Live</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Page Title <span className="text-gray-400 text-xs">(Default shown if empty)</span>
              </label>
              <LangTabs />
            </div>
            {formLang === 'en' ? (
              <input
                type="text"
                value={intro.titleEn || ''}
                onChange={(e) => setIntro({ ...intro, titleEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Page title in English"
              />
            ) : (
              <input
                type="text"
                value={intro.titleNe || ''}
                onChange={(e) => setIntro({ ...intro, titleNe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Page title in Nepali"
              />
            )}
            <p className="text-xs text-gray-400 mt-1">Leave empty to use default title</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-gray-400 text-xs">(Default content will show if empty)</span>
              </label>
              <LangTabs />
            </div>
            {formLang === 'en' ? (
              <textarea
                value={intro.contentEn || ''}
                onChange={(e) => setIntro({ ...intro, contentEn: e.target.value })}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Introduction content in English..."
              />
            ) : (
              <textarea
                value={intro.contentNe || ''}
                onChange={(e) => setIntro({ ...intro, contentNe: e.target.value })}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Introduction content in Nepali..."
              />
            )}
            <p className="text-xs text-gray-400 mt-1">Default content will be used if left empty</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-gray-400 text-xs">(Optional - upload from device)</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Introduction" 
                    className="h-32 w-auto object-cover rounded-lg border-2 border-gold/30 shadow-sm" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      setIntro({ ...intro, image: '' });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Upload className="h-4 w-4 text-gray-600" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {!imagePreview && intro.image && (
                <span className="text-xs text-gray-400">Current image will be kept</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload from device (Max 2MB, JPG/PNG/GIF)</p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={loadIntroduction}
              className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-gold" />
          Live Preview
        </h3>
        <div className="prose max-w-none">
          <h1 className="font-display text-3xl font-bold text-army">
            {intro.titleEn || intro.titleNe || 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ – एक परिचय'}
          </h1>
          {intro.titleNe && (
            <p className="text-sm text-gray-500 mt-1">{intro.titleNe}</p>
          )}
          {imagePreview && (
            <div className="my-4">
              <img 
                src={imagePreview} 
                alt="Introduction" 
                className="h-64 w-full object-cover rounded-lg shadow-md" 
              />
            </div>
          )}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {intro.contentEn || intro.contentNe || 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ नेपाली सेनाबाट अवकाश प्राप्त गरेका भूतपूर्व सैनिकहरू र तिनका परिवारहरूको कल्याण र देश र नेपाली भूमिप्रति पूर्ण आस्था र निष्ठा सहित देश र जनताको रक्षा र सेवा गर्ने उद्देश्यले स्थापना भएको हो।'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionManager;
