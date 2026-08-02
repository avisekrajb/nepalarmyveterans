import React, { useState, useEffect } from 'react';
import { centralCommitteeAPI } from '../../services/api';
import { 
  Plus, Trash2, Edit2, Upload, X, 
  ChevronDown, ChevronRight, Save, 
  Users, Shield, Award, Star, 
  UserPlus, FileText, Image as ImageIcon,
  Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const CentralCommitteeManager = () => {
  const [committeeData, setCommitteeData] = useState({
    title: 'केन्द्रीय कार्यसमिति',
    members: [],
    districtTitle: 'जिल्ला कार्यसमिति',
    districtMembers: [],
    regionalTitle: 'क्षेत्रीय सभापति',
    regionalMembers: [],
    unitTitle: 'इकाई सभापति',
    unitMembers: [],
    provincialTitle: 'प्रदेश संयोजक',
    provincialMembers: [],
    centralMembersTitle: 'केन्द्रीय सदस्य',
    centralMembers: [],
    advisoryTitle: 'सलाहकार मण्डल',
    advisoryMembers: [],
  });
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    members: true,
    districtMembers: false,
    regionalMembers: false,
    unitMembers: false,
    provincialMembers: false,
    centralMembers: false,
    advisoryMembers: false,
  });
  const [editingMember, setEditingMember] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);
  const [titleForm, setTitleForm] = useState({ section: '', title: '' });
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('members');

  const sections = [
    { key: 'members', label: 'Central Committee', icon: Shield },
    { key: 'districtMembers', label: 'District Committee', icon: Users },
    { key: 'regionalMembers', label: 'Regional Committee', icon: Award },
    { key: 'unitMembers', label: 'Unit Committee', icon: Star },
    { key: 'provincialMembers', label: 'Provincial Coordinators', icon: Users },
    { key: 'centralMembers', label: 'Central Members', icon: UserPlus },
    { key: 'advisoryMembers', label: 'Advisory Council', icon: Shield },
  ];

  const sectionTitleMap = {
    members: 'title',
    districtMembers: 'districtTitle',
    regionalMembers: 'regionalTitle',
    unitMembers: 'unitTitle',
    provincialMembers: 'provincialTitle',
    centralMembers: 'centralMembersTitle',
    advisoryMembers: 'advisoryTitle',
  };

  const getSectionTitle = (key) => {
    const titleKey = sectionTitleMap[key];
    return committeeData[titleKey] || sections.find(s => s.key === key)?.label || '';
  };

  useEffect(() => {
    loadCommitteeData();
  }, []);

  const loadCommitteeData = async () => {
    try {
      const { data } = await centralCommitteeAPI.getMembers();
      setCommitteeData(data);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load committee data');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = (section) => {
    setCurrentSection(section);
    setIsEditMode(false);
    setEditingMember(null);
    setEditingSection(section);
    setFormData({ name: '', role: '', bio: '' });
    setImagePreview(null);
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (section, index, member) => {
    setCurrentSection(section);
    setIsEditMode(true);
    setEditingSection(section);
    setEditingMember(index);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
    });
    if (member.image) {
      setImagePreview(member.image);
    } else {
      setImagePreview(null);
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', role: '', bio: '' });
    setImagePreview(null);
    setImageFile(null);
    setEditingMember(null);
    setEditingSection(null);
    setIsEditMode(false);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast.error('Name and role are required');
      return;
    }

    setUploading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('role', formData.role);
      formDataObj.append('bio', formData.bio || '');

      if (imageFile) {
        formDataObj.append('image', imageFile);
        console.log('Image file attached:', imageFile.name);
      }

      const section = currentSection;
      const index = editingMember;

      let result;
      if (isEditMode && index !== null && index !== undefined) {
        result = await centralCommitteeAPI.updateMember(section, index, formDataObj);
        toast.success('Member updated successfully');
      } else {
        result = await centralCommitteeAPI.addMember(section, formDataObj);
        toast.success('Member added successfully');
      }

      setCommitteeData(result.data);
      closeModal();
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteMember = async (section, index) => {
    if (!window.confirm('Delete this member permanently?')) return;
    try {
      const { data } = await centralCommitteeAPI.deleteMember(section, index);
      setCommitteeData(data);
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete member');
    }
  };

  const toggleSection = (key) => {
    setExpandedSections({ ...expandedSections, [key]: !expandedSections[key] });
  };

  const handleTitleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await centralCommitteeAPI.updateSectionTitle(editingTitle, { title: titleForm.title });
      setCommitteeData(data);
      toast.success('Title updated successfully');
      setEditingTitle(null);
      setTitleForm({ section: '', title: '' });
    } catch (error) {
      console.error('Title update error:', error);
      toast.error('Failed to update title');
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
          <h2 className="text-2xl font-bold text-army">Central Committee Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all committee members across different levels</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const members = committeeData[section.key] || [];
          const title = getSectionTitle(section.key);

          return (
            <div key={section.key} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Section Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.key)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gold/10 p-2 rounded-lg">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-army">{title}</h3>
                    <p className="text-xs text-gray-500">{members.length} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitle(section.key);
                      setTitleForm({ section: section.key, title: title });
                    }}
                    className="text-gray-400 hover:text-gold text-xs flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit Title
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddModal(section.key);
                    }}
                    className="bg-gold text-white text-xs px-3 py-1 rounded-lg hover:bg-gold-dark transition-colors flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                  {expandedSections[section.key] ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Title Edit Form */}
              {editingTitle === section.key && (
                <form onSubmit={handleTitleUpdate} className="px-4 pb-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={titleForm.title}
                      onChange={(e) => setTitleForm({ ...titleForm, title: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold"
                      required
                    />
                    <button type="submit" className="bg-gold text-white px-3 py-1 rounded-lg text-sm hover:bg-gold-dark">
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTitle(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Members List */}
              {expandedSections[section.key] && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow group">
                        <div className="flex items-start gap-3">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                              onError={(e) => {
                                e.target.src = 'https://placehold.co/50x50/1F3D2B/FFFFFF?text=Photo';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-army text-sm truncate">{member.name}</h4>
                            <p className="text-xs text-gold-dark font-medium truncate">{member.role}</p>
                            {member.bio && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{member.bio}</p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(section.key, index, member)}
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMember(section.key, index)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {members.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No members in this section</p>
                      <button
                        onClick={() => openAddModal(section.key)}
                        className="mt-2 text-gold hover:text-gold-dark text-sm font-medium flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add first member
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modern Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 p-4 border-b ${isEditMode ? 'bg-blue-50 border-blue-200' : 'bg-gold/10 border-gold/20'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isEditMode ? 'bg-blue-500/10' : 'bg-gold/20'}`}>
                    {isEditMode ? (
                      <Edit2 className={`h-5 w-5 ${isEditMode ? 'text-blue-500' : 'text-gold'}`} />
                    ) : (
                      <Plus className={`h-5 w-5 ${isEditMode ? 'text-blue-500' : 'text-gold'}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-army">
                      {isEditMode ? 'Edit Member' : 'Add New Member'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isEditMode ? 'Update member information' : 'Add a new member to the committee'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                    placeholder="Enter role/position"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold focus:border-transparent transition-all text-gray-700 placeholder-gray-400 resize-none"
                  placeholder="Enter brief biography..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className={`cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-gold ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : imageFile ? 'Change Image' : 'Choose Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-16 w-16 object-cover rounded-xl border-2 border-gold shadow-sm" 
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {!imagePreview && isEditMode && formData.name && (
                    <span className="text-xs text-gray-400">No image uploaded</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  <ImageIcon className="h-3 w-3 inline mr-1" />
                  JPG, PNG, GIF (Max 2MB)
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
                    isEditMode 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gold hover:bg-gold-dark'
                  } disabled:opacity-50 shadow-md hover:shadow-lg`}
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      {isEditMode ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <>
                          <Save className="h-4 w-4" />
                          Update Member
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Member
                        </>
                      )}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CentralCommitteeManager;