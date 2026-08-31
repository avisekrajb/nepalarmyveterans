import React, { useState, useEffect } from 'react';
import { faqConfigAPI } from '../../services/api';
import {
  Save, Plus, Trash2, GripVertical, Phone, Mail, MapPin, Clock,
  HelpCircle, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICON_OPTIONS = [
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'mail', label: 'Email', icon: Mail },
  { value: 'map', label: 'Location', icon: MapPin },
  { value: 'clock', label: 'Office Hours', icon: Clock },
  { value: 'help', label: 'Help', icon: HelpCircle },
  { value: 'message', label: 'Message', icon: MessageSquare },
];

const ICON_MAP = Object.fromEntries(ICON_OPTIONS.map((o) => [o.value, o.icon]));

const DEFAULT_LINKS = [
  { key: 'callUs', labelEn: 'Call Us', labelNe: 'हामीलाई फोन गर्नुहोस्', valueEn: '+977-1-1234567', valueNe: '+९७७-१-१२३४५६७', action: 'tel:+97711234567', icon: 'phone' },
  { key: 'emailUs', labelEn: 'Email Us', labelNe: 'हामीलाई इमेल गर्नुहोस्', valueEn: 'info@nepalarmy.org', valueNe: 'info@nepalarmy.org', action: 'mailto:info@nepalarmy.org', icon: 'mail' },
  { key: 'visitUs', labelEn: 'Visit Us', labelNe: 'हामीलाई भेट्नुहोस्', valueEn: 'Kathmandu, Nepal', valueNe: 'काठमाडौँ, नेपाल', action: '/contact', icon: 'map' },
  { key: 'officeHours', labelEn: 'Office Hours', labelNe: 'कार्यालय समय', valueEn: 'Mon-Fri: 10:00 AM - 5:00 PM', valueNe: 'आइत-शुक्र: बिहान १० - बेलुका ५', action: '', icon: 'clock' },
];

const FaqConfigManager = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formLang, setFormLang] = useState('en');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data } = await faqConfigAPI.getConfig();
      const links = (Array.isArray(data.quickLinks) ? data.quickLinks : []).map((l, i) => ({
        ...DEFAULT_LINKS[i] || {}, ...l,
      }));
      setConfig({
        titleEn: data.titleEn || '',
        titleNe: data.titleNe || '',
        quickLinks: links,
        supportTitleEn: data.supportTitleEn || '',
        supportTitleNe: data.supportTitleNe || '',
        supportTextEn: data.supportTextEn || '',
        supportTextNe: data.supportTextNe || '',
        supportButtonEn: data.supportButtonEn || '',
        supportButtonNe: data.supportButtonNe || '',
        supportButtonAction: data.supportButtonAction || '/contact',
      });
    } catch (error) {
      toast.error('Failed to load FAQ config');
    } finally {
      setLoading(false);
    }
  };

  const updateLink = (index, field, value) => {
    setConfig((prev) => {
      const links = [...prev.quickLinks];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, quickLinks: links };
    });
  };

  const addLink = () => {
    setConfig((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { key: '', labelEn: '', labelNe: '', valueEn: '', valueNe: '', action: '', icon: 'help' }],
    }));
  };

  const removeLink = (index) => {
    setConfig((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }));
  };

  const moveLink = (from, to) => {
    setConfig((prev) => {
      const links = [...prev.quickLinks];
      const [item] = links.splice(from, 1);
      links.splice(to, 0, item);
      return { ...prev, quickLinks: links };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        titleEn: config.titleEn,
        titleNe: config.titleNe,
        quickLinks: config.quickLinks,
        supportTitleEn: config.supportTitleEn,
        supportTitleNe: config.supportTitleNe,
        supportTextEn: config.supportTextEn,
        supportTextNe: config.supportTextNe,
        supportButtonEn: config.supportButtonEn,
        supportButtonNe: config.supportButtonNe,
        supportButtonAction: config.supportButtonAction,
      };
      await faqConfigAPI.updateConfig(payload);
      toast.success('FAQ section updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update FAQ section');
    } finally {
      setSaving(false);
    }
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

  const l = (en, ne) => (formLang === 'ne' ? (ne ?? en ?? '') : (en ?? ne ?? ''));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-army">FAQ Support Section</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the "Still Have Questions?" quick links and support banner</p>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full">
          <span className="text-xs text-green-600 font-medium">● Live</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-semibold text-army">Section Title</h3>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <LangTabs />
          </div>
          <input
            type="text"
            value={l(config.titleEn, config.titleNe)}
            onChange={(e) => setConfig(formLang === 'ne' ? { ...config, titleNe: e.target.value } : { ...config, titleEn: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder={formLang === 'ne' ? 'शीर्षक (जस्तै: अझै प्रश्नहरू छन्?)' : 'Title (e.g. Still Have Questions?)'}
          />
          <p className="text-xs text-gray-400 mt-1">Leave empty to use the default translation.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-semibold text-army">Quick Link Cards</h3>
            </div>
            <button type="button" onClick={addLink}
              className="inline-flex items-center gap-1 bg-gold text-white px-3 py-2 rounded-lg hover:bg-gold-dark transition-colors text-sm">
              <Plus className="h-4 w-4" /> Add Card
            </button>
          </div>

          {config.quickLinks.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No quick link cards. Add one to display on the FAQ page.</p>
          ) : (
            config.quickLinks.map((link, index) => {
              const Icon = ICON_MAP[link.icon] || HelpCircle;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-300" />
                      <Icon className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium text-gray-600">Card {index + 1}</span>
                    </div>
                    <button type="button" onClick={() => removeLink(index)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Remove card">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Label ({formLang === 'ne' ? 'नेपाली' : 'English'})</label>
                      <input type="text"
                        value={l(link.labelEn, link.labelNe)}
                        onChange={(e) => updateLink(index, formLang === 'ne' ? 'labelNe' : 'labelEn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                        placeholder={formLang === 'ne' ? 'लेबल (जस्तै: हामीलाई फोन गर्नुहोस्)' : 'Label (e.g. Call Us)'} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Value ({formLang === 'ne' ? 'नेपाली' : 'English'})</label>
                      <input type="text"
                        value={l(link.valueEn, link.valueNe)}
                        onChange={(e) => updateLink(index, formLang === 'ne' ? 'valueNe' : 'valueEn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                        placeholder={formLang === 'ne' ? 'मान (जस्तै: फोन नम्बर)' : 'Value (e.g. phone number)'} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <select
                          value={link.icon}
                          onChange={(e) => updateLink(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white text-sm">
                          {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Action</label>
                        <input type="text"
                          value={link.action || ''}
                          onChange={(e) => updateLink(index, 'action', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
                          placeholder="tel:, mailto:, /page" />
                      </div>
                    </div>
                  </div>
                  {index > 0 && (
                    <button type="button" onClick={() => moveLink(index, index - 1)}
                      className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">Move up</button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-semibold text-army">Support Banner</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Heading</label>
                <LangTabs />
              </div>
              <input type="text"
                value={l(config.supportTitleEn, config.supportTitleNe)}
                onChange={(e) => setConfig(formLang === 'ne' ? { ...config, supportTitleNe: e.target.value } : { ...config, supportTitleEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder={formLang === 'ne' ? 'शीर्षक' : 'Heading'} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <LangTabs />
              </div>
              <textarea rows="2" value={l(config.supportTextEn, config.supportTextNe)}
                onChange={(e) => setConfig(formLang === 'ne' ? { ...config, supportTextNe: e.target.value } : { ...config, supportTextEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder={formLang === 'ne' ? 'विवरण' : 'Description'} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label className="block text-sm font-medium text-gray-700">Button Label</label>
                  <LangTabs />
                </div>
                <input type="text" value={l(config.supportButtonEn, config.supportButtonNe)}
                  onChange={(e) => setConfig(formLang === 'ne' ? { ...config, supportButtonNe: e.target.value } : { ...config, supportButtonEn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder={formLang === 'ne' ? 'बटन लेबल' : 'Button label'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input type="text" value={config.supportButtonAction || '/contact'}
                  onChange={(e) => setConfig({ ...config, supportButtonAction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="/contact" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg">
            {saving ? (
              <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </button>
          <button type="button" onClick={loadConfig}
            className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default FaqConfigManager;
