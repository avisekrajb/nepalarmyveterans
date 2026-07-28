import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { Mail, Phone, MapPin, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactManager = () => {
  const [contact, setContact] = useState({ address: '', phone: '', email: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const { data } = await contactAPI.getContact();
      setContact(data);
    } catch (error) {
      toast.error('Failed to load contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await contactAPI.updateContact(contact);
      setContact(data);
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact info');
    } finally {
      setSaving(false);
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
      <h2 className="text-2xl font-bold text-army">Contact Management</h2>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter full address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="+977-1-1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="info@nepalarmy.org"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
            <input
              type="text"
              value={contact.mapEmbed}
              onChange={(e) => setContact({ ...contact, mapEmbed: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="text-xs text-gray-500 mt-1">Paste the embed URL from Google Maps</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3 text-army mb-2">
            <MapPin className="h-5 w-5 text-gold" />
            <span className="font-semibold">Address</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.address || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3 text-army mb-2">
            <Phone className="h-5 w-5 text-gold" />
            <span className="font-semibold">Phone</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.phone || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3 text-army mb-2">
            <Mail className="h-5 w-5 text-gold" />
            <span className="font-semibold">Email</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.email || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactManager;