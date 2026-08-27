import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { Mail, Phone, MapPin, Save, Eye, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactManager = () => {
  const [contact, setContact] = useState({ addressEn: '', addressNe: '', phoneEn: '', phoneNe: '', emailEn: '', emailNe: '', mapEmbed: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const { data } = await contactAPI.getContact();
      // If data is returned, use it, otherwise use default
      if (data) {
        setContact({
          addressEn: data.addressEn || data.address || '',
          addressNe: data.addressNe || '',
          phoneEn: data.phoneEn || data.phone || '',
          phoneNe: data.phoneNe || '',
          emailEn: data.emailEn || data.email || '',
          emailNe: data.emailNe || '',
          mapEmbed: data.mapEmbed || '',
        });
      }
    } catch (error) {
      console.error('Failed to load contact info:', error);
      toast.error('Failed to load contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await contactAPI.updateContact({
        address: contact.addressEn || contact.addressNe || '',
        addressEn: contact.addressEn,
        addressNe: contact.addressNe,
        phone: contact.phoneEn || contact.phoneNe || '',
        phoneEn: contact.phoneEn,
        phoneNe: contact.phoneNe,
        email: contact.emailEn || contact.emailNe || '',
        emailEn: contact.emailEn,
        emailNe: contact.emailNe,
        mapEmbed: contact.mapEmbed,
      });
      setContact(data);
      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update contact info');
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-army">Contact Management</h2>
          <p className="text-sm text-gray-500 mt-1">Update your contact information displayed on the website</p>
        </div>
        <div className="bg-gold/10 px-3 py-1 rounded-full">
          <span className="text-xs text-gold font-medium">Live Preview</span>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (English) <span className="text-gray-400 text-xs">(Full Address)</span>
              </label>
              <input
                type="text"
                value={contact.addressEn || ''}
                onChange={(e) => setContact({ ...contact, addressEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="Enter full address in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address (Nepali) <span className="text-gray-400 text-xs">(पूरा ठेगाना)</span>
              </label>
              <input
                type="text"
                value={contact.addressNe || ''}
                onChange={(e) => setContact({ ...contact, addressNe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="नेपालीमा पूरा ठेगाना लेख्नुहोस्"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (English) <span className="text-gray-400 text-xs">(With Country Code)</span>
              </label>
              <input
                type="text"
                value={contact.phoneEn || ''}
                onChange={(e) => setContact({ ...contact, phoneEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="+977-1-1234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Nepali) <span className="text-gray-400 text-xs">(फोन नम्बर)</span>
              </label>
              <input
                type="text"
                value={contact.phoneNe || ''}
                onChange={(e) => setContact({ ...contact, phoneNe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="+९७७-१-१२३४५६७"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (English) <span className="text-gray-400 text-xs">(Official Email)</span>
              </label>
              <input
                type="email"
                value={contact.emailEn || ''}
                onChange={(e) => setContact({ ...contact, emailEn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="info@nepalarmy.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address (Nepali) <span className="text-gray-400 text-xs">(इमेल ठेगाना)</span>
              </label>
              <input
                type="email"
                value={contact.emailNe || ''}
                onChange={(e) => setContact({ ...contact, emailNe: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="info@nepalarmy.org"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Embed URL <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              value={contact.mapEmbed || ''}
              onChange={(e) => setContact({ ...contact, mapEmbed: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-gray-500">Paste the embed URL from Google Maps</p>
              <a 
                href="https://www.google.com/maps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gold hover:text-gold-dark transition-colors"
              >
                Get Map →
              </a>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-white px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-army mb-2">
            <div className="bg-gold/10 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <span className="font-semibold">Address</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.addressEn || 'Not set'}</p>
          {contact.addressNe && <p className="text-gray-500 text-xs mt-1">{contact.addressNe}</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-army mb-2">
            <div className="bg-gold/10 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <span className="font-semibold">Phone</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.phoneEn || contact.phone || 'Not set'}</p>
          {contact.phoneNe && <p className="text-gray-500 text-xs mt-1">{contact.phoneNe}</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-army mb-2">
            <div className="bg-gold/10 p-2 rounded-lg">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <span className="font-semibold">Email</span>
          </div>
          <p className="text-gray-600 text-sm">{contact.emailEn || contact.email || 'Not set'}</p>
          {contact.emailNe && <p className="text-gray-500 text-xs mt-1">{contact.emailNe}</p>}
        </div>
      </div>

      {/* Map Preview */}
      {contact.mapEmbed && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-army mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-gold" />
            Map Preview
          </h3>
          <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
            <iframe
              src={contact.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Location Map"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gold/5 rounded-lg p-4 border border-gold/20">
        <h4 className="text-sm font-semibold text-army mb-2">💡 Quick Tips</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Keep your address, phone, and email up to date for visitors</li>
          <li>• Use the Google Maps embed to show your exact location</li>
          <li>• Changes will reflect immediately on the website</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactManager;