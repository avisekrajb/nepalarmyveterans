import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';
import { Upload, Trash2, Play, Image as ImageIcon, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

    if (!galleryTitle.trim()) {
      toast.error('Please enter a title before uploading');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const type = file.type.startsWith('video') ? 'video' : 'image';
    formData.append('type', type);
    formData.append('title', galleryTitle.trim());

    setUploading(true);
    try {
      const { data } = await galleryAPI.uploadItem(formData);
      setItems([data, ...items]);
      toast.success('File uploaded successfully');
      setGalleryTitle('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditTitle(item.title || '');
    setEditFile(null);
    setEditPreview(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditFile(null);
    setEditPreview(null);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      if (editFile) {
        formData.append('file', editFile);
      }
      const { data } = await galleryAPI.updateItem(id, formData);
      setItems(items.map(item => item._id === id ? data : item));
      cancelEdit();
      toast.success('Updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsUpdating(false);
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
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-army">Gallery Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={galleryTitle}
            onChange={(e) => setGalleryTitle(e.target.value)}
            placeholder="Enter photo/video title *"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-sm w-full sm:w-64"
          />
          <label className={`cursor-pointer px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm whitespace-nowrap ${
            galleryTitle.trim()
              ? 'bg-gold text-white hover:bg-gold-dark'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
            <Upload className="h-4 w-4" />
            Upload File (Max 50MB)
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading || !galleryTitle.trim()}
            />
          </label>
        </div>
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
            {editingId === item._id ? (
              <div className="p-3 space-y-2">
                <div className="aspect-square relative rounded overflow-hidden bg-gray-100">
                  {editPreview ? (
                    editFile?.type?.startsWith('video') ? (
                      <video src={editPreview} className="w-full h-full object-cover" />
                    ) : (
                      <img src={editPreview} alt="Preview" className="w-full h-full object-cover" />
                    )
                  ) : item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title *"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <label className="cursor-pointer bg-white hover:bg-gray-50 px-2 py-1 rounded border border-gray-300 text-xs flex items-center gap-1 justify-center w-full">
                  <Upload className="h-3 w-3" />
                  {editFile ? 'File Selected' : 'Replace File'}
                  <input type="file" accept="image/*,video/*" onChange={handleEditFileChange} className="hidden" />
                </label>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditSave(item._id)}
                    disabled={isUpdating || !editTitle.trim()}
                    className="flex-1 bg-green-600 text-white px-2 py-1.5 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isUpdating ? <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span> : <Save className="h-3 w-3" />}
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-300 text-gray-700 px-2 py-1.5 rounded text-xs hover:bg-gray-400 transition-colors flex items-center justify-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-square relative">
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Play className="h-12 w-12 text-white opacity-50" />
                      <video src={item.url} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ) : (
                    <img src={item.url} alt={item.title || 'Gallery item'} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-xs font-medium truncate w-full">{item.title || 'Untitled'}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
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
