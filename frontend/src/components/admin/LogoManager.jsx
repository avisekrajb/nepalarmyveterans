import React, { useState, useEffect } from 'react';
import { logoAPI } from '../../services/api';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const LogoManager = () => {
  const [headerLogos, setHeaderLogos] = useState({ leftLogo: { url: '', publicId: '' }, rightLogo: { url: '', publicId: '' } });
  const [footerLogo, setFooterLogo] = useState({ logo: { url: '', publicId: '' } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFiles, setLogoFiles] = useState({ left: null, right: null, footer: null });

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const [headerRes, footerRes] = await Promise.all([
        logoAPI.getHeaderLogos(),
        logoAPI.getFooterLogo(),
      ]);
      setHeaderLogos(headerRes.data);
      setFooterLogo(footerRes.data);
    } catch (error) {
      toast.error('Failed to load logos');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        leftLogo: headerLogos.leftLogo,
        rightLogo: headerLogos.rightLogo,
      };
      const { data: updated } = await logoAPI.updateHeaderLogos(data);
      setHeaderLogos(updated);
      setLogoFiles({ ...logoFiles, left: null, right: null });
      toast.success('Header logos updated successfully');
    } catch (error) {
      toast.error('Failed to update header logos');
    } finally {
      setSaving(false);
    }
  };

  const handleFooterSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: updated } = await logoAPI.updateFooterLogo({ logo: footerLogo.logo });
      setFooterLogo(updated);
      setLogoFiles({ ...logoFiles, footer: null });
      toast.success('Footer logo updated successfully');
    } catch (error) {
      toast.error('Failed to update footer logo');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = (type, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      if (type === 'left') {
        setHeaderLogos({ ...headerLogos, leftLogo: { ...headerLogos.leftLogo, url: imageUrl } });
        setLogoFiles({ ...logoFiles, left: file });
      } else if (type === 'right') {
        setHeaderLogos({ ...headerLogos, rightLogo: { ...headerLogos.rightLogo, url: imageUrl } });
        setLogoFiles({ ...logoFiles, right: file });
      } else if (type === 'footer') {
        setFooterLogo({ logo: { ...footerLogo.logo, url: imageUrl } });
        setLogoFiles({ ...logoFiles, footer: file });
      }
    };
    reader.readAsDataURL(file);
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
      <h2 className="text-2xl font-bold text-army">Logo Management</h2>

      {/* Header Logos */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4">Header Logos</h3>
        <form onSubmit={handleHeaderSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Left Logo</label>
              {headerLogos.leftLogo?.url && (
                <div className="mb-2">
                  <img src={headerLogos.leftLogo.url} alt="Left Logo" className="h-20 w-auto object-contain" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleLogoUpload('left', e.target.files[0]);
                  }
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Right Logo</label>
              {headerLogos.rightLogo?.url && (
                <div className="mb-2">
                  <img src={headerLogos.rightLogo.url} alt="Right Logo" className="h-20 w-auto object-contain" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleLogoUpload('right', e.target.files[0]);
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Update Header Logos'}
          </button>
        </form>
      </div>

      {/* Footer Logo */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4">Footer Logo</h3>
        <form onSubmit={handleFooterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Logo</label>
            {footerLogo.logo?.url && (
              <div className="mb-2">
                <img src={footerLogo.logo.url} alt="Footer Logo" className="h-20 w-auto object-contain" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleLogoUpload('footer', e.target.files[0]);
                }
              }}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Update Footer Logo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogoManager;