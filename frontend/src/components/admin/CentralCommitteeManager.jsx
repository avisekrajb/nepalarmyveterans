import React, { useState, useEffect } from 'react';
import { centralCommitteeAPI } from '../../services/api';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const CentralCommitteeManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data } = await centralCommitteeAPI.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load committee members:', error);
      toast.error('Failed to load committee members');
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
        const { data } = await centralCommitteeAPI.updateMember(editing, formDataObj);
        setMembers(members.map(m => m._id === editing ? data : m));
        toast.success('Member updated successfully');
      } else {
        const { data } = await centralCommitteeAPI.createMember(formDataObj);
        setMembers([data, ...members]);
        toast.success('Member created successfully');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await centralCommitteeAPI.deleteMember(id);
      setMembers(members.filter(m => m._id !== id));
      toast.success('Member deleted');
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const editMember = (member) => {
    setEditing(member._id);
    setFormData({ name: member.name, role: member.role, bio: member.bio || '' });
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
        <h2 className="text-2xl font-bold text-army">Central Committee Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Member
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
                placeholder="Brief description about the member"
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
              <p className="text-xs text-gray-500 mt-1">Upload from device (JPEG, PNG, WebP)</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4">
                    <img 
                      src={member.image || 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=Photo'} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-army">{member.name}</td>
                  <td className="px-6 py-4 text-gray-600">{member.role}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{member.bio || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => editMember(member)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteMember(member._id)} 
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No committee members added yet</p>
            <p className="text-sm mt-1">Click "Add Member" to create your first committee member</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralCommitteeManager;