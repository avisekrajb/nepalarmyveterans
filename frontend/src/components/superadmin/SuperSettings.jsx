import React, { useState, useEffect } from 'react';
import { superAdminAPI, settingsAPI } from '../../services/api';
import { Settings, Save, AlertCircle, Calendar, Clock, Lock, Unlock, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SuperSettings = () => {
  const [logoSize, setLogoSize] = useState({ width: 80, height: 80, position: 'left' });
  const [maintenance, setMaintenance] = useState({
    message: '',
    endDate: '',
    enabled: false,
    lockedSections: [],
  });
  const [newSection, setNewSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const sections = [
    'Hero Banner', 'Leadership', 'Central Committee', 'Gallery', 
    'News', 'Events', 'Notices', 'Contact', 'Introduction', 'Logos'
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await settingsAPI.getSettings();
      if (data) {
        setLogoSize({
          width: data.logoWidth || 80,
          height: data.logoHeight || 80,
          position: data.logoPosition || 'left',
        });
        setMaintenance({
          message: data.maintenanceMessage || '',
          endDate: data.maintenanceEndDate ? new Date(data.maintenanceEndDate).toISOString().slice(0, 16) : '',
          enabled: data.maintenanceMode || false,
          lockedSections: data.lockedSections || [],
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleLogoSizeUpdate = async () => {
    setLoading(true);
    try {
      await superAdminAPI.updateLogoSize(logoSize);
      toast.success('Logo size updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update logo size');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceUpdate = async () => {
    setLoading(true);
    try {
      await superAdminAPI.addMaintenance(maintenance);
      toast.success('Maintenance settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update maintenance');
    } finally {
      setLoading(false);
    }
  };

  const addLockedSection = () => {
    if (newSection && !maintenance.lockedSections.includes(newSection)) {
      setMaintenance({
        ...maintenance,
        lockedSections: [...maintenance.lockedSections, newSection],
      });
      setNewSection('');
    }
  };

  const removeLockedSection = (section) => {
    setMaintenance({
      ...maintenance,
      lockedSections: maintenance.lockedSections.filter(s => s !== section),
    });
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-army">Super Admin Settings</h2>

      {/* Logo Size Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-gold" />
          Logo Size Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
            <input
              type="number"
              value={logoSize.width}
              onChange={(e) => setLogoSize({ ...logoSize, width: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              min="40"
              max="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              type="number"
              value={logoSize.height}
              onChange={(e) => setLogoSize({ ...logoSize, height: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              min="40"
              max="150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={logoSize.position}
              onChange={(e) => setLogoSize({ ...logoSize, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleLogoSizeUpdate}
          disabled={loading}
          className="mt-4 bg-gold text-white px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Update Logo Size
        </button>
      </div>

      {/* Maintenance Notice */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-army mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Maintenance Notice
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
            <textarea
              value={maintenance.message}
              onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              placeholder="Enter maintenance message..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
            <input
              type="datetime-local"
              value={maintenance.endDate}
              onChange={(e) => setMaintenance({ ...maintenance, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          
          {/* Locked Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Locked Sections</label>
            <div className="flex gap-2 mb-2">
              <select
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="">Select section to lock</option>
                {sections.filter(s => !maintenance.lockedSections.includes(s)).map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
              <button
                onClick={addLockedSection}
                className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {maintenance.lockedSections.map((section) => (
                <span key={section} className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-full">
                  <Lock className="h-3 w-3" />
                  {section}
                  <button
                    onClick={() => removeLockedSection(section)}
                    className="hover:text-red-900 transition-colors ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Sections selected will be locked during maintenance</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(e) => setMaintenance({ ...maintenance, enabled: e.target.checked })}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700 font-medium">
              {maintenance.enabled ? (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Maintenance Mode Active
                </span>
              ) : (
                <span className="text-gray-500 flex items-center gap-1">
                  <Unlock className="h-4 w-4" />
                  Maintenance Mode Inactive
                </span>
              )}
            </label>
          </div>

          <button
            onClick={handleMaintenanceUpdate}
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${
              maintenance.enabled 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gold hover:bg-gold-dark text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : maintenance.enabled ? 'Update Maintenance' : 'Enable Maintenance'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Settings className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Logo Width</p>
              <p className="text-xl font-bold text-army">{logoSize.width}px</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <p className={`text-xl font-bold ${maintenance.enabled ? 'text-red-500' : 'text-green-500'}`}>
                {maintenance.enabled ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Lock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Locked Sections</p>
              <p className="text-xl font-bold text-army">{maintenance.lockedSections.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm font-bold text-army">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperSettings;