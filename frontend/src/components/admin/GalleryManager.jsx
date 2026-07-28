import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';
import { Upload, Trash2, Play, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const { data } = await galleryAPI.getGallery();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    formData.append('type', type);
    formData.append('title', file.name);

    setUploading(true);
    try {
      const { data } = await galleryAPI.uploadItem(formData);
      setItems([data, ...items]);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await galleryAPI.deleteItem(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-army">Gallery Management</h2>
        <label className="cursor-pointer bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload File (Max 50MB)
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploading && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Uploading... Please wait</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item._id} className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-square relative">
              {item.type === 'video' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-50" />
                  <video src={item.url} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ) : (
                <img src={item.url} alt={item.title || 'Gallery item'} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => deleteItem(item._id)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                {item.type === 'video' ? '🎬 ' : '🖼️ '}
                {item.title || 'Untitled'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No gallery items uploaded yet</p>
          <p className="text-sm text-gray-400">Upload images or videos (max 50MB)</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;