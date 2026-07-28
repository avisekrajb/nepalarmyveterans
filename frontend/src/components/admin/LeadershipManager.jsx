import React, { useState, useEffect } from 'react';
import { leadershipAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LeadershipManager = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      const { data } = await leadershipAPI.getLeadership();
      setLeaders(data);
    } catch (error) {
      toast.error('Failed to load leadership data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('role', formData.role);
    formDataObj.append('bio', formData.bio);
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    try {
      if (editing) {
        const { data } = await leadershipAPI.updateLeader(editing, formDataObj);
        setLeaders(leaders.map(l => l._id === editing ? data : l));
        toast.success('Leader updated successfully');
      } else {
        const { data } = await leadershipAPI.createLeader(formDataObj);
        setLeaders([data, ...leaders]);
        toast.success('Leader created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteLeader = async (id) => {
    if (!window.confirm('Delete this leader?')) return;
    try {
      await leadershipAPI.deleteLeader(id);
      setLeaders(leaders.filter(l => l._id !== id));
      toast.success('Leader deleted');
    } catch (error) {
      toast.error('Failed to delete leader');
    }
  };

  const editLeader = (leader) => {
    setEditing(leader._id);
    setFormData({ name: leader.name, role: leader.role, bio: leader.bio });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '' });
    setImageFile(null);
    setEditing(null);
    setShowForm(false);
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
        <h2 className="text-2xl font-bold text-army">Leadership Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Leader
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaders.map((leader) => (
              <tr key={leader._id}>
                <td className="px-6 py-4">
                  <img src={leader.image || 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=Photo'} alt={leader.name} className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="px-6 py-4 font-medium text-army">{leader.name}</td>
                <td className="px-6 py-4 text-gray-600">{leader.role}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => editLeader(leader)} className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteLeader(leader._id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leaders.length === 0 && (
          <p className="text-center text-gray-500 py-8">No leaders added yet</p>
        )}
      </div>
    </div>
  );
};

export default LeadershipManager;