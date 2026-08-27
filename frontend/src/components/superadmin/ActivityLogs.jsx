import React, { useState, useEffect, useCallback } from 'react';
import { superAdminAPI } from '../../services/api';
import { Search, Filter, Calendar, Eye, RefreshCw, User, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = { 
        page, 
        limit: 20, 
        type: filter,
        search: searchTerm || undefined
      };
      
      const { data } = await superAdminAPI.getLogs(params);
      
      // Check if data exists and has logs
      if (data && data.logs) {
        setLogs(data.logs);
        setTotalPages(data.totalPages || 1);
        setTotalLogs(data.total || data.logs.length);
      } else {
        setLogs([]);
        setTotalPages(1);
        setTotalLogs(0);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error(error.response?.data?.message || 'Failed to load logs');
      setLogs([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLogs();
  };

  const getActionColor = (action) => {
    const colors = {
      'CREATE': 'text-green-500 bg-green-50',
      'UPDATE': 'text-blue-500 bg-blue-50',
      'DELETE': 'text-red-500 bg-red-50',
      'LOGIN': 'text-purple-500 bg-purple-50',
      'LOGOUT': 'text-gray-500 bg-gray-50',
      'VIEW': 'text-indigo-500 bg-indigo-50',
      'UPLOAD': 'text-amber-500 bg-amber-50',
      'DOWNLOAD': 'text-cyan-500 bg-cyan-50',
      'EDIT': 'text-blue-500 bg-blue-50',
      'REMOVE': 'text-red-500 bg-red-50',
      'ADD': 'text-green-500 bg-green-50',
    };
    return colors[action] || 'text-gray-500 bg-gray-50';
  };

  const getActionIcon = (action) => {
    const icons = {
      'CREATE': '➕',
      'UPDATE': '✏️',
      'DELETE': '🗑️',
      'LOGIN': '🔐',
      'LOGOUT': '🚪',
      'VIEW': '👁️',
      'UPLOAD': '📤',
      'DOWNLOAD': '📥',
      'EDIT': '📝',
      'REMOVE': '❌',
      'ADD': '✅',
    };
    return icons[action] || '📌';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return formatDate(dateString);
    } catch {
      return '';
    }
  };

  const getModuleBadge = (module) => {
    const colors = {
      'AUTH': 'bg-purple-100 text-purple-700',
      'HERO': 'bg-blue-100 text-blue-700',
      'LEADERSHIP': 'bg-indigo-100 text-indigo-700',
      'GALLERY': 'bg-pink-100 text-pink-700',
      'NEWS': 'bg-green-100 text-green-700',
      'EVENTS': 'bg-orange-100 text-orange-700',
      'NOTICES': 'bg-red-100 text-red-700',
      'CONTACT': 'bg-cyan-100 text-cyan-700',
      'SETTINGS': 'bg-gray-100 text-gray-700',
      'USERS': 'bg-teal-100 text-teal-700',
      'SYSTEM': 'bg-slate-100 text-slate-700',
    };
    return colors[module] || 'bg-gray-100 text-gray-700';
  };

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-army flex items-center gap-2">
            <Eye className="h-6 w-6 text-gold" />
            Activity Logs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalLogs} logs recorded • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
          >
            <option value="all">All Logs</option>
            <option value="admin">Admin Logs</option>
            <option value="visitor">Visitor Logs</option>
            <option value="system">System Logs</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search logs by admin, action, module..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-sm"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs && logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr 
                    key={log._id || index} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {(page - 1) * 20 + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-army font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        {log.adminEmail || 'System'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getActionColor(log.action)}`}>
                        <span>{getActionIcon(log.action)}</span>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleBadge(log.module)}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="font-mono text-xs">{log.ip || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(log.timestamp)}</span>
                        <span className="text-xs text-gray-400">{getTimeAgo(log.timestamp)}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-8 w-8 text-gray-300" />
                      <p className="text-gray-500">No logs found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 text-sm">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-army flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gold" />
                  Log Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Admin</p>
                    <p className="font-medium text-army">{selectedLog.adminEmail || 'System'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Action</p>
                    <p className="font-medium text-army">{selectedLog.action}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Module</p>
                    <p className="font-medium text-army">{selectedLog.module}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Timestamp</p>
                    <p className="font-medium text-army">{formatDate(selectedLog.timestamp)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Details</p>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
                    {selectedLog.details ? JSON.stringify(selectedLog.details, null, 2) : 'No details available'}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="font-mono text-sm text-army">{selectedLog.ip || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Log ID</p>
                    <p className="font-mono text-xs text-gray-500 break-all">{selectedLog._id}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="mt-6 w-full bg-gold text-white py-2 rounded-lg hover:bg-gold-dark transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ActivityLogs;