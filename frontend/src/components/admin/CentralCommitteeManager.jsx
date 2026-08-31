import React, { useState, useEffect, useMemo } from 'react';
import { centralCommitteeAPI } from '../../services/api';
import ImageCropperModal from './ImageCropperModal';
import {
  Plus, Trash2, Edit2, Upload, X, Search, ChevronDown, ChevronRight,
  Save, Users, Shield, Award, Star, UserPlus, Clock, Calendar, AlertTriangle, Power, MinusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const PROVINCES = [
  { number: 1, nameEn: 'Koshi Province', nameNe: 'कोशी प्रदेश' },
  { number: 2, nameEn: 'Madhesh Province', nameNe: 'मधेश प्रदेश' },
  { number: 3, nameEn: 'Bagmati Province', nameNe: 'बागमती प्रदेश' },
  { number: 4, nameEn: 'Gandaki Province', nameNe: 'गण्डकी प्रदेश' },
  { number: 5, nameEn: 'Lumbini Province', nameNe: 'लुम्बिनी प्रदेश' },
  { number: 6, nameEn: 'Karnali Province', nameNe: 'कर्णाली प्रदेश' },
  { number: 7, nameEn: 'Sudurpashchim Province', nameNe: 'सुदूरपश्चिम प्रदेश' },
];

const DISTRICTS = {
  1: [
    { en: 'Taplejung', ne: 'ताप्लेजुङ' }, { en: 'Panchthar', ne: 'पाँचथर' }, { en: 'Ilam', ne: 'इलाम' },
    { en: 'Jhapa', ne: 'झापा' }, { en: 'Morang', ne: 'मोरङ' }, { en: 'Sunsari', ne: 'सुनसरी' },
    { en: 'Dhankuta', ne: 'धनकुटा' }, { en: 'Terhathum', ne: 'तेह्रथुम' }, { en: 'Sankhuwasabha', ne: 'संखुवासभा' },
    { en: 'Bhojpur', ne: 'भोजपुर' }, { en: 'Okhaldhunga', ne: 'ओखलढुङ्गा' }, { en: 'Solukhumbu', ne: 'सोलुखुम्बु' },
    { en: 'Khotang', ne: 'खोटाङ' }, { en: 'Udayapur', ne: 'उदयपुर' },
  ],
  2: [
    { en: 'Saptari', ne: 'सप्तरी' }, { en: 'Siraha', ne: 'सिरहा' }, { en: 'Dhanusha', ne: 'धनुषा' },
    { en: 'Mahottari', ne: 'महोत्तरी' }, { en: 'Sarlahi', ne: 'सर्लाही' }, { en: 'Rautahat', ne: 'राउटहट' },
    { en: 'Bara', ne: 'बारा' }, { en: 'Parsa', ne: 'पर्सा' },
  ],
  3: [
    { en: 'Dolakha', ne: 'दोलखा' }, { en: 'Ramechhap', ne: 'रामेछाप' }, { en: 'Sindhuli', ne: 'सिन्धुली' },
    { en: 'Kavrepalanchok', ne: 'काभ्रेपलाञ्चोक' }, { en: 'Bhaktapur', ne: 'भक्तपुर' }, { en: 'Kathmandu', ne: 'काठमाडौँ' },
    { en: 'Lalitpur', ne: 'ललितपुर' }, { en: 'Nuwakot', ne: 'नुवाकोट' }, { en: 'Rasuwa', ne: 'रसुवा' },
    { en: 'Dhading', ne: 'धादिङ' }, { en: 'Makwanpur', ne: 'मकवानपुर' }, { en: 'Chitwan', ne: 'चितवन' },
    { en: 'Gorkha', ne: 'गोरखा' },
  ],
  4: [
    { en: 'Manang', ne: 'मनाङ' }, { en: 'Mustang', ne: 'मुस्ताङ' }, { en: 'Myagdi', ne: 'म्याग्दी' },
    { en: 'Kaski', ne: 'कास्की' }, { en: 'Lamjung', ne: 'लमजुङ' }, { en: 'Tanahu', ne: 'तनहुँ' },
    { en: 'Nawalparasi East', ne: 'नवलपरासी पूर्व' }, { en: 'Syangja', ne: 'स्याङजा' }, { en: 'Palpa', ne: 'पाल्पा' },
    { en: 'Gulmi', ne: 'गुल्मी' }, { en: 'Baglung', ne: 'बागलुङ' },
  ],
  5: [
    { en: 'Rupandehi', ne: 'रुपन्देही' }, { en: 'Kapilvastu', ne: 'कपिलवस्तु' }, { en: 'Nawalparasi West', ne: 'नवलपरासी पश्चिम' },
    { en: 'Rukum East', ne: 'रुकुम पूर्व' }, { en: 'Rolpa', ne: 'रोल्पा' }, { en: 'Pyuthan', ne: 'प्युठान' },
    { en: 'Syanggdia', ne: 'स्याङग्दिया' }, { en: 'Dang', ne: 'दाङ' }, { en: 'Banke', ne: 'बाँके' },
    { en: 'Bardiya', ne: 'बर्दिया' }, { en: 'Surkhet', ne: 'सुर्खेत' }, { en: 'Dailekh', ne: 'दैलेख' },
  ],
  6: [
    { en: 'Humla', ne: 'हुम्ला' }, { en: 'Mugu', ne: 'मुगु' }, { en: 'Dolpa', ne: 'डोल्पा' },
    { en: 'Jumla', ne: 'जुम्ला' }, { en: 'Kalikot', ne: 'कलिकोट' }, { en: 'Jajarkot', ne: 'जाजरकोट' },
    { en: 'Rukum West', ne: 'रुकुम पश्चिम' }, { en: 'Salyan', ne: 'सल्यान' }, { en: 'Chhanna', ne: 'छान्ना' },
    { en: 'Tribeni', ne: 'त्रिवेणी' },
  ],
  7: [
    { en: 'Bajhang', ne: 'बझाङ' }, { en: 'Bajura', ne: 'बाजुरा' }, { en: 'Achham', ne: 'अच्छाम' },
    { en: 'Doti', ne: 'डोटी' }, { en: 'Darchula', ne: 'दार्चुला' }, { en: 'Baitadi', ne: 'बैतडी' },
    { en: 'Dadeldhura', ne: 'डडेलधुरा' }, { en: 'Kailali', ne: 'कैलाली' }, { en: 'Kanchanpur', ne: 'कञ्चनपुर' },
  ],
};

const SECTION_CONFIG = {
  supervisors: {
    label: 'संरक्षक', labelEn: 'Supervisors', icon: Shield,
    headerBg: 'bg-emerald-600', rowEven: 'bg-emerald-50/40', rowOdd: 'bg-white',
    badge: 'bg-emerald-100 text-emerald-700', pill: 'bg-emerald-500',
  },
  advisors: {
    label: 'सल्लाहकार', labelEn: 'Advisors', icon: Award,
    headerBg: 'bg-amber-600', rowEven: 'bg-amber-50/40', rowOdd: 'bg-white',
    badge: 'bg-amber-100 text-amber-700', pill: 'bg-amber-500',
  },
  centralCommittee: {
    label: 'केन्द्रीय समिति', labelEn: 'Central Committee', icon: Star,
    headerBg: 'bg-[#1F3D2B]', rowEven: 'bg-[#1F3D2B]/[0.03]', rowOdd: 'bg-white',
    badge: 'bg-[#1F3D2B]/10 text-[#1F3D2B]', pill: 'bg-[#1F3D2B]',
  },
  centralMembers: {
    label: 'केन्द्रीय सदस्य', labelEn: 'Central Members', icon: Users,
    headerBg: 'bg-blue-600', rowEven: 'bg-blue-50/40', rowOdd: 'bg-white',
    badge: 'bg-blue-100 text-blue-700', pill: 'bg-blue-500',
  },
  provinceCoordinators: {
    label: 'प्रदेश संयोजक', labelEn: 'Province Coordinators', icon: UserPlus,
    headerBg: 'bg-purple-600', rowEven: 'bg-purple-50/40', rowOdd: 'bg-white',
    badge: 'bg-purple-100 text-purple-700', pill: 'bg-purple-500',
  },
  districtCommittee: {
    label: 'जिल्ला कार्यसमिति', labelEn: 'District Committee', icon: Users,
    headerBg: 'bg-rose-600', rowEven: 'bg-rose-50/40', rowOdd: 'bg-white',
    badge: 'bg-rose-100 text-rose-700', pill: 'bg-rose-500',
  },
};

const SECTION_KEYS = ['supervisors', 'advisors', 'centralCommittee', 'centralMembers', 'provinceCoordinators', 'districtCommittee'];

const INITIAL_FORM = {
  name: '', nameEn: '', nameNe: '',
  role: '', roleEn: '', roleNe: '',
  bio: '', bioEn: '', bioNe: '',
  section: 'centralCommittee',
  province: '', provinceEn: '', provinceNe: '', provinceNumber: '',
  district: '', districtEn: '', districtNe: '',
  electionDate: '', termYears: '5', order: '0',
};

const getBothLangs = (en, ne, plain) => {
  const val = en || ne || plain || '';
  return { en: en || val, ne: ne || val };
};

const CentralCommitteeManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const [expandedSections, setExpandedSections] = useState(
    Object.fromEntries(SECTION_KEYS.map((k) => [k, true]))
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cropSource, setCropSource] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data } = await centralCommitteeAPI.getAll();
      setMembers(data.members || []);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load committee data');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    let result = members;
    if (activeSection !== 'all') result = result.filter((m) => m.section === activeSection);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) =>
        (m.name || '').toLowerCase().includes(q) || (m.nameEn || '').toLowerCase().includes(q) ||
        (m.nameNe || '').includes(q) || (m.role || '').toLowerCase().includes(q) ||
        (m.roleEn || '').toLowerCase().includes(q) || (m.roleNe || '').includes(q) ||
        (m.provinceEn || '').toLowerCase().includes(q) || (m.districtEn || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [members, activeSection, searchQuery]);

  const sectionCounts = useMemo(() => {
    const counts = {};
    SECTION_KEYS.forEach((k) => { counts[k] = members.filter((m) => m.section === k).length; });
    return counts;
  }, [members]);

  const groupedBySection = useMemo(() => {
    const groups = {};
    SECTION_KEYS.forEach((k) => { groups[k] = filteredMembers.filter((m) => m.section === k); });
    return groups;
  }, [filteredMembers]);

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const openAddModal = (section) => {
    setIsEditMode(false); setEditingId(null);
    setFormData({ ...INITIAL_FORM, section: section || 'centralCommittee' });
    setImageFile(null); setImagePreview(null); setShowModal(true);
  };

  const openEditModal = (member) => {
    setIsEditMode(true); setEditingId(member._id || member.id);
    setFormData({
      name: member.name || '', nameEn: member.nameEn || '', nameNe: member.nameNe || '',
      role: member.role || '', roleEn: member.roleEn || '', roleNe: member.roleNe || '',
      bio: member.bio || '', bioEn: member.bioEn || '', bioNe: member.bioNe || '',
      section: member.section || 'centralCommittee',
      province: member.province || '', provinceEn: member.provinceEn || '',
      provinceNe: member.provinceNe || '', provinceNumber: member.provinceNumber || '',
      district: member.district || '', districtEn: member.districtEn || '',
      districtNe: member.districtNe || '',
      electionDate: member.electionDate ? member.electionDate.substring(0, 10) : '',
      termYears: member.termYears ? String(member.termYears) : '5',
      order: member.order != null ? String(member.order) : '0',
    });
    setImageFile(null); setImagePreview(member.image || null); setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setFormData({ ...INITIAL_FORM });
    setImageFile(null); setImagePreview(null); setCropSource(null);
    setEditingId(null); setIsEditMode(false); setUploading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { toast.error('Image size should be less than 2MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSource(reader.result);
        setImageFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = (blob) => {
    setImageFile(blob);
    setImagePreview(URL.createObjectURL(blob));
    setCropSource(null);
  };

  const handleProvinceChange = (provinceNumber) => {
    const province = PROVINCES.find((p) => p.number === Number(provinceNumber));
    setFormData((prev) => ({
      ...prev, provinceNumber,
      province: province ? province.nameEn : '',
      provinceEn: province ? province.nameEn : '',
      provinceNe: province ? province.nameNe : '',
      district: '', districtEn: '', districtNe: '',
    }));
  };

  const handleDistrictChange = (districtName) => {
    const districts = DISTRICTS[formData.provinceNumber] || [];
    const found = districts.find(d => d.en === districtName);
    setFormData((prev) => ({
      ...prev, district: districtName, districtEn: districtName,
      districtNe: found ? found.ne : districtName,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.nameEn && !formData.nameNe) { toast.error('Name is required'); return; }
    if (!formData.role && !formData.roleEn && !formData.roleNe) { toast.error('Role is required'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name || formData.nameEn || formData.nameNe);
      fd.append('nameEn', formData.nameEn || formData.nameNe || '');
      fd.append('nameNe', formData.nameNe || formData.nameEn || '');
      fd.append('role', formData.role || formData.roleEn || formData.roleNe);
      fd.append('roleEn', formData.roleEn || formData.roleNe || '');
      fd.append('roleNe', formData.roleNe || formData.roleEn || '');
      fd.append('bio', formData.bio || formData.bioEn || formData.bioNe || '');
      fd.append('bioEn', formData.bioEn || formData.bioNe || '');
      fd.append('bioNe', formData.bioNe || formData.bioEn || '');
      fd.append('section', formData.section);
      if (formData.section === 'provinceCoordinators' || formData.section === 'districtCommittee') {
        fd.append('province', formData.province || '');
        fd.append('provinceEn', formData.provinceEn || '');
        fd.append('provinceNe', formData.provinceNe || '');
        fd.append('provinceNumber', formData.provinceNumber || '');
      }
      if (formData.section === 'districtCommittee') {
        fd.append('district', formData.district || '');
        fd.append('districtEn', formData.districtEn || '');
        fd.append('districtNe', formData.districtNe || '');
      }
      if (formData.electionDate) fd.append('electionDate', formData.electionDate);
      else fd.append('electionDate', '');
      fd.append('termYears', formData.termYears || '5');
      fd.append('order', formData.order || '0');
      if (imageFile) fd.append('image', imageFile);

      if (isEditMode && editingId) {
        await centralCommitteeAPI.updateMember(editingId, fd);
        toast.success('Member updated successfully');
      } else {
        await centralCommitteeAPI.addMember(fd);
        toast.success('Member added successfully');
      }
      closeModal();
      loadMembers();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member permanently?')) return;
    try {
      await centralCommitteeAPI.deleteMember(id);
      toast.success('Member deleted successfully');
      loadMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleExtendTerm = async (id) => {
    try {
      await centralCommitteeAPI.extendTerm(id);
      toast.success('Term extended successfully');
      loadMembers();
    } catch (error) {
      toast.error('Failed to extend term');
    }
  };

  const handleRemoveExtension = async (id) => {
    if (!window.confirm('Remove the +1 year extension for this member?')) return;
    try {
      await centralCommitteeAPI.removeExtension(id);
      toast.success('Extension removed successfully');
      loadMembers();
    } catch (error) {
      toast.error('Failed to remove extension');
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await centralCommitteeAPI.toggleActive(id, !currentActive);
      toast.success(currentActive ? 'Marked as inactive' : 'Marked as active');
      loadMembers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getRemainingDays = (member) => {
    if (!member.electionDate) return null;
    const election = new Date(member.electionDate);
    let years = (member.termYears || 5);
    if (member.extended) years += 1; // extra 1 year after the term
    const termMs = years * 365.25 * 24 * 60 * 60 * 1000;
    return Math.ceil((new Date(election.getTime() + termMs) - new Date()) / (1000 * 60 * 60 * 24));
  };

  const formatTimeLeft = (days) => {
    const d = Math.abs(Math.round(days));
    const months = Math.floor(d / 30);
    const remDays = d % 30;
    if (months > 0 && remDays > 0) return `${months}m ${remDays}d`;
    if (months > 0) return `${months}m`;
    return `${remDays}d`;
  };

  const canExtend = (member) => {
    if (member.extended) return false;
    if (!member.electionDate) return false;
    const election = new Date(member.electionDate);
    const yearsPassed = (new Date() - election) / (1000 * 60 * 60 * 24 * 365);
    // Allow extending with +1 year once 4 years have passed (but before 5 years).
    return yearsPassed >= 4 && yearsPassed < 5;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#C9A227] border-t-transparent" />
      </div>
    );
  }

  const renderSectionTable = (sectionKey) => {
    const config = SECTION_CONFIG[sectionKey];
    const Icon = config.icon;
    const sectionMembers = groupedBySection[sectionKey] || [];
    const isExpanded = expandedSections[sectionKey];
    const showProvince = sectionKey === 'provinceCoordinators' || sectionKey === 'districtCommittee';
    const showDistrict = sectionKey === 'districtCommittee';

    if (activeSection === 'all' && sectionMembers.length === 0) return null;

    return (
      <div key={sectionKey} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${config.badge}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1F3D2B] text-sm">{config.labelEn}</h3>
              <p className="text-xs text-gray-400">{config.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              {sectionMembers.length} {sectionMembers.length === 1 ? 'member' : 'members'}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); openAddModal(sectionKey); }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#C9A227] text-white text-xs font-medium rounded-lg hover:bg-[#b8921f] transition-colors"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
            {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4">
            {sectionMembers.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No members in this section</p>
                <button onClick={() => openAddModal(sectionKey)} className="mt-2 text-[#C9A227] hover:text-[#b8921f] text-sm font-medium inline-flex items-center gap-1 transition-colors">
                  <Plus className="h-4 w-4" /> Add first member
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`${config.headerBg} text-white text-xs uppercase tracking-wider`}>
                      <th className="px-3 py-2.5 text-left w-10">#</th>
                      <th className="px-3 py-2.5 text-left w-12">Photo</th>
                      <th className="px-3 py-2.5 text-left">Name (English)</th>
                      <th className="px-3 py-2.5 text-left">Name (नेपाली)</th>
                      <th className="px-3 py-2.5 text-left">Role (English)</th>
                      <th className="px-3 py-2.5 text-left">Role (नेपाली)</th>
                      {showProvince && <th className="px-3 py-2.5 text-left">Province</th>}
                      {showDistrict && <th className="px-3 py-2.5 text-left">District</th>}
                      <th className="px-3 py-2.5 text-left">Term</th>
                      <th className="px-3 py-2.5 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionMembers.map((member, idx) => {
                      const nameLangs = getBothLangs(member.nameEn, member.nameNe, member.name);
                      const roleLangs = getBothLangs(member.roleEn, member.roleNe, member.role);
                      const remainingDays = getRemainingDays(member);
                      const termExpired = remainingDays !== null && remainingDays < 0;
                      const rowBg = idx % 2 === 0 ? config.rowEven : config.rowOdd;

                      return (
                        <tr key={member._id || idx} onClick={() => openEditModal(member)}
                          className={`${rowBg} hover:brightness-95 transition-all border-t border-gray-100 cursor-pointer`}>
                          <td className="px-3 py-2.5 text-gray-400 font-medium">{idx + 1}</td>
                          <td className="px-3 py-2.5">
                            {member.image ? (
                              <img src={member.image} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[#C9A227]/30" onError={(e) => { e.target.src = 'https://placehold.co/40x40/1F3D2B/FFFFFF?text=P'; }} />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                <Users className="h-4 w-4 text-gray-300" />
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="font-medium text-[#1F3D2B]">{nameLangs.en || '—'}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="text-gray-600">{nameLangs.ne || '—'}</div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`${config.badge} px-2 py-0.5 rounded-full text-[11px] font-medium inline-block`}>
                              {roleLangs.en || '—'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className="text-gray-500 text-[11px]">{roleLangs.ne || '—'}</span>
                          </td>
                          {showProvince && (
                            <td className="px-3 py-2.5 text-gray-500 text-xs">
                              {getBothLangs(member.provinceEn, member.provinceNe, member.province).en || '—'}
                            </td>
                          )}
                          {showDistrict && (
                            <td className="px-3 py-2.5 text-gray-500 text-xs">
                              {getBothLangs(member.districtEn, member.districtNe, member.district).en || '—'}
                            </td>
                          )}
                          <td className="px-3 py-2.5">
                            {member.electionDate ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] text-gray-500 inline-flex items-center gap-0.5">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(member.electionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                {remainingDays !== null && (
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${termExpired ? 'bg-red-50 text-red-600' : remainingDays <= 180 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {termExpired ? `Expired ${formatTimeLeft(remainingDays)}` : `${formatTimeLeft(remainingDays)} left`}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-300 text-xs">No date</span>
                            )}
                            {member.extended && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 font-medium ml-1">
                                Extended +1yr
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveExtension(member._id || member.id); }}
                                  className="text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-0.5" title="Remove extension">
                                  <MinusCircle className="h-3 w-3" /> Remove
                                </button>
                              </span>
                            )}
                            {canExtend(member) && (
                              <button onClick={(e) => { e.stopPropagation(); handleExtendTerm(member._id || member.id); }}
                                className="text-[10px] text-[#C9A227] hover:text-[#b8921f] font-medium ml-1 inline-flex items-center gap-0.5">
                                <AlertTriangle className="h-2.5 w-2.5" /> Extend +1 year
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={(e) => { e.stopPropagation(); openEditModal(member); }} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(member._id || member.id); }} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleToggleActive(member._id || member.id, member.active !== false); }}
                                className={`p-1.5 rounded-lg transition-colors ${member.active === false ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'}`}
                                title={member.active === false ? 'Click to activate' : 'Click to deactivate'}>
                                <Power className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1F3D2B]">Central Committee Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              {members.length} total members across {SECTION_KEYS.length} sections
            </p>
          </div>
          <button onClick={() => openAddModal('centralCommittee')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F3D2B] text-white rounded-xl hover:bg-[#1F3D2B]/90 transition-colors font-medium text-sm shadow-md shadow-[#1F3D2B]/20">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, province, or district..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent shadow-sm transition-all placeholder-gray-400" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveSection('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${activeSection === 'all' ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
            <Users className="h-3.5 w-3.5" /> All
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeSection === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>{members.length}</span>
          </button>
          {SECTION_KEYS.map((key) => {
            const config = SECTION_CONFIG[key]; const Icon = config.icon; const isActive = activeSection === key;
            return (
              <button key={key} onClick={() => setActiveSection(key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${isActive ? `${config.pill} text-white border-transparent shadow-md` : `${config.badge} hover:opacity-80`}`}>
                <Icon className="h-3.5 w-3.5" /> {config.labelEn}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-black/5'}`}>{sectionCounts[key]}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {(activeSection === 'all' ? SECTION_KEYS : [activeSection]).map(renderSectionTable)}

          {activeSection !== 'all' && (groupedBySection[activeSection] || []).length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-1">No members found</p>
              <button onClick={() => openAddModal(activeSection)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A227] text-white text-sm font-medium rounded-xl hover:bg-[#b8921f] transition-colors mt-3">
                <Plus className="h-4 w-4" /> Add Member
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className={`sticky top-0 z-10 p-5 border-b ${isEditMode ? 'bg-blue-50 border-blue-200' : 'bg-[#C9A227]/10 border-[#C9A227]/20'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isEditMode ? 'bg-blue-500/10' : 'bg-[#C9A227]/20'}`}>
                    {isEditMode ? <Edit2 className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-[#C9A227]" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1F3D2B]">{isEditMode ? 'Edit Member' : 'Add New Member'}</h3>
                    <p className="text-xs text-gray-500">{isEditMode ? 'Update member information' : 'Fill in the details below'}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Name (English) <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400" placeholder="English name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">नाम (नेपाली)</label>
                  <input type="text" value={formData.nameNe} onChange={(e) => setFormData({ ...formData, nameNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400" placeholder="नेपाली नाम" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Role (English) <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.roleEn} onChange={(e) => setFormData({ ...formData, roleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400" placeholder="Role / Position" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">पद (नेपाली)</label>
                  <input type="text" value={formData.roleNe} onChange={(e) => setFormData({ ...formData, roleNe: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400" placeholder="नेपालीमा पद" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Bio (English)</label>
                  <textarea value={formData.bioEn} onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })} rows="3"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400 resize-none" placeholder="Brief biography..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">जीवनी (नेपाली)</label>
                  <textarea value={formData.bioNe} onChange={(e) => setFormData({ ...formData, bioNe: e.target.value })} rows="3"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all placeholder-gray-400 resize-none" placeholder="नेपालीमा जीवनी..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Photo</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className={`cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#C9A227] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : imageFile ? 'Change' : 'Choose Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploading} />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-xl border-2 border-[#C9A227] shadow-sm" />
                      <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-md">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, GIF (Max 2MB)</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Section</label>
                <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all bg-white">
                  {SECTION_KEYS.map((key) => (
                    <option key={key} value={key}>{SECTION_CONFIG[key].labelEn} — {SECTION_CONFIG[key].label}</option>
                  ))}
                </select>
              </div>

              {(formData.section === 'provinceCoordinators' || formData.section === 'districtCommittee') && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Province</label>
                  <select value={formData.provinceNumber} onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all bg-white">
                    <option value="">Select Province</option>
                    {PROVINCES.map((p) => (<option key={p.number} value={p.number}>{p.number}. {p.nameEn} ({p.nameNe})</option>))}
                  </select>
                </div>
              )}

              {formData.section === 'districtCommittee' && formData.provinceNumber && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">District</label>
                  <select value={formData.district} onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all bg-white">
                    <option value="">Select District</option>
                    {(DISTRICTS[formData.provinceNumber] || []).map((d) => (<option key={d.en} value={d.en}>{d.en} ({d.ne})</option>))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Election Date</label>
                  <input type="date" value={formData.electionDate} onChange={(e) => setFormData({ ...formData, electionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Term (years)</label>
                  <input type="number" min="1" max="6" value={formData.termYears} onChange={(e) => setFormData({ ...formData, termYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all" />
                  <p className="text-[11px] text-gray-400 mt-1">
                    5 years is the election rule (default). Max 6 years. Extension is +1 year only, available after 4 years.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Display Order</label>
                <input type="number" min="0" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition-all" placeholder="0" />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="submit" disabled={uploading}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#1F3D2B] hover:bg-[#1F3D2B]/90'} disabled:opacity-50 shadow-md hover:shadow-lg`}>
                  {uploading ? (
                    <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />{isEditMode ? 'Updating...' : 'Adding...'}</>
                  ) : isEditMode ? (<><Save className="h-4 w-4" /> Update Member</>) : (<><Plus className="h-4 w-4" /> Add Member</>)}
                </button>
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper */}
      {cropSource && (
        <ImageCropperModal
          imageSrc={cropSource}
          aspectRatio={4 / 3}
          onCancel={() => setCropSource(null)}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
};

export default CentralCommitteeManager;
