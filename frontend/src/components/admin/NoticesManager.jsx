import React, { useState, useEffect } from 'react';
import { noticesAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload, Image, X, Eye, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

const NoticesManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', titleEn: '', titleNe: '', content: '', contentEn: '', contentNe: '', date: '', showInModal: false });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formLang, setFormLang] = useState('en');

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data } = await noticesAPI.getNotices();
      setNotices(data);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
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
    formDataObj.append('title', formData.titleEn || '');
    formDataObj.append('titleEn', formData.titleEn);
    formDataObj.append('titleNe', formData.titleNe);
    formDataObj.append('content', formData.contentEn || '');
    formDataObj.append('contentEn', formData.contentEn);
    formDataObj.append('contentNe', formData.contentNe);
    if (formData.date) formDataObj.append('date', formData.date);
    formDataObj.append('showInModal', formData.showInModal);
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    setUploading(true);
    try {
      if (editing) {
        const { data } = await noticesAPI.updateNotice(editing, formDataObj);
        setNotices(notices.map(n => n._id === editing ? data : n));
        toast.success('Notice updated successfully');
      } else {
        const { data } = await noticesAPI.createNotice(formDataObj);
        setNotices([data, ...notices]);
        toast.success('Notice created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setUploading(false);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm('Delete this notice permanently?')) return;
    try {
      await noticesAPI.deleteNotice(id);
      setNotices(notices.filter(n => n._id !== id));
      toast.success('Notice deleted successfully');
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const editNotice = (item) => {
    setEditing(item._id);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || item.title || '',
      titleNe: item.titleNe || '',
      content: item.content,
      contentEn: item.contentEn || item.content || '',
      contentNe: item.contentNe || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      showInModal: item.showInModal || false,
    });
    if (item.image && item.image !== '') {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', titleEn: '', titleNe: '', content: '', contentEn: '', contentNe: '', date: '', showInModal: false });
    setImageFile(null);
    setImagePreview(null);
    setEditing(null);
    setShowForm(false);
    setFormLang('en');
  };

  const toggleModalStatus = async (id, currentStatus) => {
    try {
      if (!currentStatus) {
        const notice = notices.find(n => n._id === id);
        if (notice) {
          const formDataObj = new FormData();
          formDataObj.append('title', notice.titleEn || notice.title);
          formDataObj.append('titleEn', notice.titleEn || '');
          formDataObj.append('titleNe', notice.titleNe || '');
          formDataObj.append('content', notice.contentEn || notice.content);
          formDataObj.append('contentEn', notice.contentEn || '');
          formDataObj.append('contentNe', notice.contentNe || '');
          formDataObj.append('showInModal', 'true');
          if (notice.date) formDataObj.append('date', notice.date);
          const { data } = await noticesAPI.updateNotice(id, formDataObj);
          setNotices(notices.map(n => n._id === id ? data : n));
          toast.success('Notice set as modal notice');
        }
      } else {
        const notice = notices.find(n => n._id === id);
        if (notice) {
          const formDataObj = new FormData();
          formDataObj.append('title', notice.titleEn || notice.title);
          formDataObj.append('titleEn', notice.titleEn || '');
          formDataObj.append('titleNe', notice.titleNe || '');
          formDataObj.append('content', notice.contentEn || notice.content);
          formDataObj.append('contentEn', notice.contentEn || '');
          formDataObj.append('contentNe', notice.contentNe || '');
          formDataObj.append('showInModal', 'false');
          if (notice.date) formDataObj.append('date', notice.date);
          const { data } = await noticesAPI.updateNotice(id, formDataObj);
          setNotices(notices.map(n => n._id === id ? data : n));
          toast.success('Notice removed from modal');
        }
      }
    } catch (error) {
      toast.error('Failed to update modal status');
    }
  };

  const hasImage = (item) => {
    return item.image && item.image !== '' && item.image !== null && item.image !== undefined;
  };

  const getModalNotice = () => {
    return notices.find(n => n.showInModal === true);
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

  const modalNotice = getModalNotice();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-army">Notices Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage notices with images stored in Cloudinary</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Notice
        </button>
      </div>

      {modalNotice && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gold p-2 rounded-lg">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-army">Modal Notice Active</p>
              <p className="text-sm text-gray-600">"{modalNotice.titleEn || modalNotice.title}" is currently showing in the modal</p>
            </div>
          </div>
          <button
            onClick={() => toggleModalStatus(modalNotice._id, true)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Remove from Modal
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Title in English"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={formData.titleNe}
                  onChange={(e) => setFormData({ ...formData, titleNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Title in Nepali"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Content in English"
                  required
                />
              ) : (
                <textarea
                  value={formData.contentNe}
                  onChange={(e) => setFormData({ ...formData, contentNe: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Content in Nepali"
                />
              )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
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
              <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, showInModal: !formData.showInModal })}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gold transition-colors"
              >
                {formData.showInModal ? (
                  <CheckSquare className="h-5 w-5 text-gold" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
                Show this notice in modal popup
              </button>
            </div>
            {formData.showInModal && (
              <p className="text-xs text-gold-dark bg-gold/5 p-2 rounded-lg border border-gold/20">
                <Eye className="h-3 w-3 inline mr-1" />
                This notice will appear as a popup modal when users visit the website. Only one notice can be shown at a time.
              </p>
            )}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notices.map((item) => {
                const hasImageValue = hasImage(item);
                return (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      {hasImageValue ? (
                        <img 
                          src={item.image} 
                          alt={item.titleEn || item.title} 
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-army">{item.titleEn || item.title}</div>
                      {item.titleNe && <div className="text-xs text-gray-400 truncate max-w-xs">{item.titleNe}</div>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleModalStatus(item._id, item.showInModal)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.showInModal 
                            ? 'bg-gold text-white hover:bg-gold-dark' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {item.showInModal ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <Square className="h-3 w-3" />
                            Set as Modal
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {hasImageValue ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          With Image
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          No Image
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => editNotice(item)} 
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteNotice(item._id)} 
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
        {notices.length === 0 && (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notices created yet</p>
            <p className="text-sm text-gray-400">Click "Create Notice" to add your first notice</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Notices</p>
          <p className="text-2xl font-bold text-army">{notices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">With Images</p>
          <p className="text-2xl font-bold text-army">{notices.filter(n => hasImage(n)).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Modal Notice</p>
          <p className="text-lg font-bold text-gold truncate">
            {modalNotice ? (modalNotice.titleEn || modalNotice.title) : 'None set'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Latest Notice</p>
          <p className="text-sm font-medium text-army truncate">
            {notices.length > 0 ? (notices[0].titleEn || notices[0].title) : 'No notices'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoticesManager;
