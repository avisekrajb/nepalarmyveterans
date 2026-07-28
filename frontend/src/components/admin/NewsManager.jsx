import React, { useState, useEffect } from 'react';
import { newsAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', date: '' });
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data } = await newsAPI.getNews();
      setNews(data);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('content', formData.content);
    if (formData.date) formDataObj.append('date', formData.date);
    if (imageFile) formDataObj.append('image', imageFile);

    try {
      if (editing) {
        const { data } = await newsAPI.updateNews(editing, formDataObj);
        setNews(news.map(n => n._id === editing ? data : n));
        toast.success('News updated successfully');
      } else {
        const { data } = await newsAPI.createNews(formDataObj);
        setNews([data, ...news]);
        toast.success('News created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm('Delete this news?')) return;
    try {
      await newsAPI.deleteNews(id);
      setNews(news.filter(n => n._id !== id));
      toast.success('News deleted');
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  const editNews = (item) => {
    setEditing(item._id);
    setFormData({
      title: item.title,
      content: item.content,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', date: '' });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
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
        <h2 className="text-2xl font-bold text-army">News Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create News
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  <img src={item.image || 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=News'} alt={item.title} className="w-10 h-10 rounded object-cover" />
                </td>
                <td className="px-6 py-4 font-medium text-army">{item.title}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => editNews(item)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteNews(item._id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {news.length === 0 && (
          <p className="text-center text-gray-500 py-8">No news created yet</p>
        )}
      </div>
    </div>
  );
};

export default NewsManager;