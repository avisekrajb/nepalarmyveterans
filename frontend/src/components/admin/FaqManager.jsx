import React, { useState, useEffect, useMemo } from 'react';
import { faqAPI } from '../../services/api';
import { Plus, Trash2, Edit2, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_CATEGORIES = [
  { en: 'General', ne: 'सामान्य' },
  { en: 'Membership', ne: 'सदस्यता' },
  { en: 'Services & Programs', ne: 'सेवा र कार्यक्रम' },
  { en: 'Support & Assistance', ne: 'सहयोग र सहायता' },
];

const FaqManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLang, setFormLang] = useState('en');
  const [customCategory, setCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    categoryEn: '', categoryNe: '', questionEn: '', questionNe: '',
    answerEn: '', answerNe: '', order: '0',
  });

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const { data } = await faqAPI.getFaqs();
      setItems(data);
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const seen = {};
    items.forEach((item) => {
      const key = item.categoryEn || item.category || 'General';
      if (!seen[key]) seen[key] = { en: key, ne: item.categoryNe || item.category || key };
    });
    return [...DEFAULT_CATEGORIES.filter((c) => !seen[c.en]), ...Object.values(seen)];
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.questionEn.trim() && !formData.questionNe.trim()) {
      toast.error('Question (English) is required');
      return;
    }
    const fd = {
      categoryEn: formData.categoryEn.trim() || 'General',
      categoryNe: formData.categoryNe.trim() || formData.categoryEn.trim() || 'General',
      questionEn: formData.questionEn,
      questionNe: formData.questionNe,
      answerEn: formData.answerEn,
      answerNe: formData.answerNe,
      order: formData.order || 0,
    };
    try {
      if (editing) {
        const { data } = await faqAPI.updateFaq(editing, fd);
        setItems(items.map(item => item._id === editing ? data : item));
        toast.success('FAQ updated successfully');
      } else {
        const { data } = await faqAPI.createFaq(fd);
        setItems([...items, data]);
        toast.success('FAQ created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await faqAPI.deleteFaq(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('FAQ deleted');
    } catch (error) {
      toast.error('Failed to delete FAQ');
    }
  };

  const editItem = (item) => {
    setEditing(item._id);
    setFormData({
      categoryEn: item.categoryEn || item.category || '',
      categoryNe: item.categoryNe || '',
      questionEn: item.questionEn || item.question || '',
      questionNe: item.questionNe || '',
      answerEn: item.answerEn || item.answer || '',
      answerNe: item.answerNe || '',
      order: item.order != null ? String(item.order) : '0',
    });
    setCustomCategory(!DEFAULT_CATEGORIES.some((c) => c.en === (item.categoryEn || item.category)));
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ categoryEn: '', categoryNe: '', questionEn: '', questionNe: '', answerEn: '', answerNe: '', order: '0' });
    setEditing(null);
    setShowForm(false);
    setFormLang('en');
    setCustomCategory(false);
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
        <h2 className="text-2xl font-bold text-army">FAQ Management</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <div className="flex gap-2">
                  {!customCategory ? (
                    <select value={formData.categoryEn}
                      onChange={(e) => {
                        const cat = DEFAULT_CATEGORIES.find((c) => c.en === e.target.value);
                        setFormData({ ...formData, categoryEn: e.target.value, categoryNe: cat ? cat.ne : '' });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent">
                      <option value="">Select category</option>
                      {DEFAULT_CATEGORIES.map((c) => <option key={c.en} value={c.en}>{c.en}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={formData.categoryEn}
                      onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Category in English" />
                  )}
                  <button type="button" onClick={() => setCustomCategory(!customCategory)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                    {customCategory ? 'Use preset' : 'Custom'}
                  </button>
                </div>
              ) : (
                <input type="text" value={formData.categoryNe}
                  onChange={(e) => setFormData({ ...formData, categoryNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="श्रेणी नेपालीमा" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Question *</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <input type="text" value={formData.questionEn} onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Question in English" required />
              ) : (
                <input type="text" value={formData.questionNe} onChange={(e) => setFormData({ ...formData, questionNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="प्रश्न नेपालीमा" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Answer</label>
                <LangTabs />
              </div>
              {formLang === 'en' ? (
                <textarea rows="3" value={formData.answerEn} onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Answer in English" />
              ) : (
                <textarea rows="3" value={formData.answerNe} onChange={(e) => setFormData({ ...formData, answerNe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="उत्तर नेपालीमा" />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full text-xs font-medium">
                    <HelpCircle className="h-3 w-3" />
                    {item.categoryEn || item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-army">{item.questionEn || item.question}</div>
                  {item.questionNe && <div className="text-xs text-gray-400">{item.questionNe}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-md">
                  <p className="line-clamp-2">{item.answerEn || item.answer}</p>
                  {item.answerNe && <p className="text-xs text-gray-400 line-clamp-1">{item.answerNe}</p>}
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
          <p className="text-center text-gray-500 py-8">No FAQs added yet</p>
        )}
      </div>
    </div>
  );
};

export default FaqManager;