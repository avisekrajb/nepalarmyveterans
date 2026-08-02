import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload, Image, X, Video, User, Calendar, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const InterviewManager = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    guest: '',
    team: '',
    content: '',
    type: 'image',
    videoUrl: '',
    date: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const { data } = await interviewAPI.getInterviews();
      setInterviews(data);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
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
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('guest', formData.guest);
    formDataObj.append('team', formData.team);
    formDataObj.append('content', formData.content);
    formDataObj.append('type', formData.type);
    if (formData.videoUrl) formDataObj.append('videoUrl', formData.videoUrl);
    if (formData.date) formDataObj.append('date', formData.date);
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    setUploading(true);
    try {
      if (editing) {
        const { data } = await interviewAPI.updateInterview(editing, formDataObj);
        setInterviews(interviews.map(i => i._id === editing ? data : i));
        toast.success('Interview updated successfully');
      } else {
        const { data } = await interviewAPI.createInterview(formDataObj);
        setInterviews([data, ...interviews]);
        toast.success('Interview created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (!window.confirm('Delete this interview permanently?')) return;
    try {
      await interviewAPI.deleteInterview(id);
      setInterviews(interviews.filter(i => i._id !== id));
      toast.success('Interview deleted successfully');
    } catch (error) {
      toast.error('Failed to delete interview');
    }
  };

  const editInterview = (item) => {
    setEditing(item._id);
    setFormData({
      title: item.title,
      guest: item.guest,
      team: item.team || '',
      content: item.content,
      type: item.type || 'image',
      videoUrl: item.videoUrl || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    });
    if (item.image && item.image !== '') {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      guest: '',
      team: '',
      content: '',
      type: 'image',
      videoUrl: '',
      date: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setEditing(null);
    setShowForm(false);
  };

  const hasImage = (item) => {
    return item.image && item.image !== '' && item.image !== null && item.image !== undefined;
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
        <div>
          <h2 className="text-2xl font-bold text-army">Interview Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage interviews with photos, videos, and guest details</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Interview
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                <input
                  type="text"
                  value={formData.guest}
                  onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team/Organization</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="e.g., Nepal Army, Veterans Association"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">Paste YouTube or Vimeo video URL</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
              <div className="flex items-center gap-4 flex-wrap">
                <label className={`cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Choose Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded border border-gray-200" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload guest photo (Max 10MB)</p>
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Uploading...
                  </>
                ) : (
                  editing ? 'Update' : 'Create'
                )}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interviews.map((item) => {
                const hasImageValue = hasImage(item);
                return (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      {hasImageValue ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=Photo';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-army">{item.title}</div>
                      <div className="text-sm text-gray-500">Guest: {item.guest}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.team || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        item.type === 'video' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'video' ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <Image className="h-3 w-3" />
                        )}
                        {item.type || 'image'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => editInterview(item)} 
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteInterview(item._id)} 
                          className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {interviews.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No interviews created yet</p>
            <p className="text-sm text-gray-400">Click "Create Interview" to add your first interview</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Interviews</p>
          <p className="text-2xl font-bold text-army">{interviews.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">With Images</p>
          <p className="text-2xl font-bold text-army">{interviews.filter(i => hasImage(i)).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Videos</p>
          <p className="text-2xl font-bold text-army">{interviews.filter(i => i.type === 'video').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Latest Interview</p>
          <p className="text-sm font-medium text-army truncate">
            {interviews.length > 0 ? interviews[0].title : 'No interviews'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewManager;