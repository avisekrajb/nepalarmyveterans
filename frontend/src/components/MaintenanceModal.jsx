import React, { useState, useEffect } from 'react';
import { X, Shield, Clock, AlertTriangle, Lock, Calendar, Wrench } from 'lucide-react';
import { settingsAPI } from '../services/api';

const MaintenanceModal = () => {
  const [maintenance, setMaintenance] = useState({
    maintenanceMode: false,
    maintenanceMessage: '',
    maintenanceEndDate: null,
    lockedSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkMaintenance();
  }, []);

  const checkMaintenance = async () => {
    try {
      const { data } = await settingsAPI.getSettings();
      if (data.maintenanceMode) {
        setMaintenance({
          maintenanceMode: data.maintenanceMode,
          maintenanceMessage: data.maintenanceMessage || 'Site is currently under maintenance. Please check back later.',
          maintenanceEndDate: data.maintenanceEndDate,
          lockedSections: data.lockedSections || [],
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to check maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Not specified';
    }
  };

  if (loading || !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-white font-bold text-xl">Maintenance Mode</h2>
          <p className="text-red-100 text-sm mt-1">Site is currently under maintenance</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">Notice</p>
              <p className="text-sm text-red-600">{maintenance.maintenanceMessage}</p>
            </div>
          </div>

          {maintenance.maintenanceEndDate && (
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-4">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Expected completion</p>
                <p className="text-sm font-medium text-army">{formatDate(maintenance.maintenanceEndDate)}</p>
              </div>
            </div>
          )}

          {maintenance.lockedSections && maintenance.lockedSections.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-500 mb-2">Locked Sections</p>
              <div className="flex flex-wrap gap-2">
                {maintenance.lockedSections.map((section, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                    <Lock className="h-3 w-3" />
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Shield className="h-5 w-5 text-blue-500" />
            <p className="text-xs text-blue-600">
              We're working on improving your experience. Please check back later.
            </p>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-full mt-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;