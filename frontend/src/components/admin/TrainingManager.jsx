import React, { useState, useEffect } from 'react';
import { trainingAPI } from '../../services/api';
import { Plus, Trash2, Edit2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

const TrainingManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLang, setFormLang] = useState('en');
  const [formData, setFormData] = useState({
    nameEn: '', nameNe: '', duration: '', eligibilityEn: '', eligibilityNe: '', order: '0',
    features: [],
  });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const { data } = await trainingAPI.getTrainings();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load training programs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nameEn.trim() && !formData.nameNe.trim()) {
      toast.error('Name (English) is required');
      return;
    }
    const features = (formData.features || [])
      .map((f) => ({ en: (f.en || '').trim(), ne: (f.ne || '').trim() }))
      .filter((f) => f.en || f.ne);
    const fd = {
      nameEn: formData.nameEn,
      nameNe: formData.nameNe,
      duration: formData.duration,
      eligibilityEn: formData.eligibilityEn,
      eligibilityNe: formData.eligibilityNe,
      order: formData.order || 0,
      features,
    };
    try {
      if (editing) {
        const { data } = await trainingAPI.updateTraining(editing, fd);
        setItems(items.map(item => item._id === editing ? data : item));
        toast.success('Training updated successfully');
      } else {
        const { data } = await trainingAPI.createTraining(fd);
        setItems([...items, data]);
        toast.success('Training created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try {
      await trainingAPI.deleteTraining(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Training deleted');
    } catch (error) {
      toast.error('Failed to delete training');
    }
  };

  const editItem = (item) => {
    setEditing(item._id);
    setFormData({
      nameEn: item.nameEn || item.name || '',
      nameNe: item.nameNe || '',
      duration: item.duration || '',
      eligibilityEn: item.eligibilityEn || item.eligibility || '',
      eligibilityNe: item.eligibilityNe || '',
      order: item.order != null ? String(item.order) : '0',
      features: (item.features || []).map((f) => ({ en: f.en || '', ne: f.ne || '' })),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nameEn: '', nameNe: '', duration: '', eligibilityEn: '', eligibilityNe: '', order: '0', features: [] });
    setEditing(null);
    setShowForm(false);
    setFormLang('en');
  };

  const updateFeature = (index, field, value) => {
    setFormData((prev) => {
      const features = [...(prev.features || [])];
      features[index] = { ...(features[index] || {}), [field]: value };
      return { ...prev, features };
    });
  };

  const addFeature = () => setFormData((prev) => ({ ...prev, features: [...(prev.features || []), { en: '', ne: '' }] }));
  const removeFeature = (index) => setFormData((prev) => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));

  const LangTabs = () => (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      <button type="button" onClick={() => setFormLang('en')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${formLang === 'en' ? 'bg-white text-army shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>EN</button>
      <button type="button" onClick={() => setFormLang('ne')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${formLang === 'ne' ? 'bg-white text-army shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>NE</button>
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
        <h2 className="text-2xl font-bold text-army">Training Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Training
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <input type="text" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Name in English" required />
              ) : (
                <input type="text" value={formData.nameNe} onChange={(e) => setFormData({ ...formData, nameNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="नाम नेपालीमा" />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g. 3 months)</label>
                <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="e.g. 3 months" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" min="0" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Eligibility</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <input type="text" value={formData.eligibilityEn} onChange={(e) => setFormData({ ...formData, eligibilityEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Eligibility in English" />
              ) : (
                <input type="text" value={formData.eligibilityNe} onChange={(e) => setFormData({ ...formData, eligibilityNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="योग्यता नेपालीमा" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button type="button" onClick={addFeature}
                  className="inline-flex items-center gap-1 text-xs text-gold-dark hover:text-gold font-medium">
                  <Plus className="h-3.5 w-3.5" /> Add feature
                </button>
              </div>
              <div className="space-y-2">
                {(formData.features || []).map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input type="text" value={feature.en}
                      onChange={(e) => updateFeature(index, 'en', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                      placeholder="Feature (English)" />
                    <input type="text" value={feature.ne}
                      onChange={(e) => updateFeature(index, 'ne', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                      placeholder="विशेषता (नेपाली)" />
                    <button type="button" onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-army inline-flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-gold" />
                    {item.nameEn || item.name}
                  </div>
                  {item.nameNe && <div className="text-xs text-gray-400">{item.nameNe}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600">{item.duration || '—'}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {(item.features || []).slice(0, 3).map((f, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{f.en}</span>
                    ))}
                    {(item.features || []).length > 3 && (
                      <span className="text-xs text-gray-400">+{(item.features || []).length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => editItem(item)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteItem(item._id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="text-center text-gray-500 py-8">No training programs added yet</p>
        )}
      </div>
    </div>
  );
};

export default TrainingManager;