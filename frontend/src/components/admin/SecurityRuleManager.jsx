import React, { useState, useEffect } from 'react';
import { securityRulesAPI } from '../../services/api';
import { Plus, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityRuleManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLang, setFormLang] = useState('en');
  const [formData, setFormData] = useState({ titleEn: '', titleNe: '', descriptionEn: '', descriptionNe: '', order: '0' });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const { data } = await securityRulesAPI.getSecurityRules();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load security rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titleEn.trim() && !formData.titleNe.trim()) {
      toast.error('Title (English) is required');
      return;
    }
    try {
      if (editing) {
        const { data } = await securityRulesAPI.updateSecurityRule(editing, { ...formData, order: formData.order || 0 });
        setItems(items.map(item => item._id === editing ? data : item));
        toast.success('Security rule updated successfully');
      } else {
        const { data } = await securityRulesAPI.createSecurityRule({ ...formData, order: formData.order || 0 });
        setItems([...items, data]);
        toast.success('Security rule created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this security rule?')) return;
    try {
      await securityRulesAPI.deleteSecurityRule(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Security rule deleted');
    } catch (error) {
      toast.error('Failed to delete security rule');
    }
  };

  const editItem = (item) => {
    setEditing(item._id);
    setFormData({
      titleEn: item.titleEn || item.title || '',
      titleNe: item.titleNe || '',
      descriptionEn: item.descriptionEn || item.description || '',
      descriptionNe: item.descriptionNe || '',
      order: item.order != null ? String(item.order) : '0',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ titleEn: '', titleNe: '', descriptionEn: '', descriptionNe: '', order: '0' });
    setEditing(null);
    setShowForm(false);
    setFormLang('en');
  };

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
        <h2 className="text-2xl font-bold text-army">Security Rules Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Rule
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
                <input type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Title in English" required />
              ) : (
                <input type="text" value={formData.titleNe} onChange={(e) => setFormData({ ...formData, titleNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="शीर्षक नेपालीमा" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <textarea rows="3" value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Description in English" />
              ) : (
                <textarea rows="3" value={formData.descriptionNe} onChange={(e) => setFormData({ ...formData, descriptionNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="विवरण नेपालीमा" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input type="number" min="0" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={item._id}>
                <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-army inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    {item.titleEn || item.title}
                  </div>
                  {item.titleNe && <div className="text-xs text-gray-400">{item.titleNe}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-md">
                  <p className="line-clamp-2">{item.descriptionEn || item.description}</p>
                  {item.descriptionNe && <p className="text-xs text-gray-400 line-clamp-1">{item.descriptionNe}</p>}
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
          <p className="text-center text-gray-500 py-8">No security rules added yet</p>
        )}
      </div>
    </div>
  );
};

export default SecurityRuleManager;