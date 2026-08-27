import React, { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', titleEn: '', titleNe: '', description: '', descriptionEn: '', descriptionNe: '', date: '', location: '', locationEn: '', locationNe: '' });
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLang, setFormLang] = useState('en');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await eventsAPI.getEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('title', formData.titleEn || '');
    formDataObj.append('titleEn', formData.titleEn);
    formDataObj.append('titleNe', formData.titleNe);
    formDataObj.append('description', formData.descriptionEn || '');
    formDataObj.append('descriptionEn', formData.descriptionEn);
    formDataObj.append('descriptionNe', formData.descriptionNe);
    formDataObj.append('date', formData.date);
    formDataObj.append('location', formData.location);
    if (imageFile) formDataObj.append('image', imageFile);

    try {
      if (editing) {
        const { data } = await eventsAPI.updateEvent(editing, formDataObj);
        setEvents(events.map(e => e._id === editing ? data : e));
        toast.success('Event updated successfully');
      } else {
        const { data } = await eventsAPI.createEvent(formDataObj);
        setEvents([data, ...events]);
        toast.success('Event created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsAPI.deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
      toast.success('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const editEvent = (item) => {
    setEditing(item._id);
    setFormData({
      title: item.title,
      titleEn: item.titleEn || item.title || '',
      titleNe: item.titleNe || '',
      description: item.description || '',
      descriptionEn: item.descriptionEn || item.description || '',
      descriptionNe: item.descriptionNe || '',
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      location: item.location || '',
      locationEn: item.locationEn || item.location || '',
      locationNe: item.locationNe || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', titleEn: '', titleNe: '', description: '', descriptionEn: '', descriptionNe: '', date: '', location: '', locationEn: '', locationNe: '' });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
    setFormLang('en');
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
        <h2 className="text-2xl font-bold text-army">Events Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </button>
      </div>

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
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Description in English"
                />
              ) : (
                <textarea
                  value={formData.descriptionNe}
                  onChange={(e) => setFormData({ ...formData, descriptionNe: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Description in Nepali"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  <img src={item.image || 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=Event'} alt={item.titleEn || item.title} className="w-10 h-10 rounded object-cover" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-army">{item.titleEn || item.title}</div>
                  {item.titleNe && <div className="text-xs text-gray-400">{item.titleNe}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{item.location || 'N/A'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => editEvent(item)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteEvent(item._id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="text-center text-gray-500 py-8">No events created yet</p>
        )}
      </div>
    </div>
  );
};

export default EventsManager;
