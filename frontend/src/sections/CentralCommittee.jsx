import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/ui/Loader';
import { Container } from '../components/ui/Section';
import { centralCommitteeAPI } from '../services/api';
import {
  ChevronDown, ChevronUp, Users, Shield, Award, MapPin,
  X, BadgeCheck, UserRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION_CONFIG = [
  { key: 'supervisors', labelEn: 'Supervisors', labelNe: 'सङ्रक्षक', icon: Shield },
  { key: 'advisors', labelEn: 'Advisors', labelNe: 'सल्लाहकार', icon: Award },
  { key: 'centralCommittee', labelEn: 'Central Committee', labelNe: 'केन्द्रीय समिति', icon: Users },
  { key: 'centralMembers', labelEn: 'Central Members', labelNe: 'केन्द्रीय सदस्य', icon: Users },
  { key: 'provinceCoordinators', labelEn: 'Province Coordinators', labelNe: 'प्रदेश संयोजक', icon: MapPin },
  { key: 'districtCommittee', labelEn: 'District Committees', labelNe: 'जिल्ला कार्यसमिति', icon: MapPin },
];

// Role badge colors alternate ONLY between army green and gold
const ROLE_COLORS = [
  'bg-army text-white',
  'bg-gold text-white',
];

const PROVINCE_NAMES = {
  1: { en: 'Koshi Province', ne: 'कोशी प्रदेश' },
  2: { en: 'Madhesh Province', ne: 'मधेश प्रदेश' },
  3: { en: 'Bagmati Province', ne: 'बागमती प्रदेश' },
  4: { en: 'Gandaki Province', ne: 'गण्डकी प्रदेश' },
  5: { en: 'Lumbini Province', ne: 'लुम्बिनी प्रदेश' },
  6: { en: 'Karnali Province', ne: 'कर्णाली प्रदेश' },
  7: { en: 'Sudurpashchim Province', ne: 'सुदूरपश्चिम प्रदेश' },
};

const CentralCommittee = () => {
  const { t } = useTranslation();
  const { isNepali } = useLanguage();
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState({});
  const [expandedProvinces, setExpandedProvinces] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock page scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = selectedMember ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedMember]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const { data } = await centralCommitteeAPI.getAll();
      setAllMembers(data.members || []);
    } catch (error) {
      console.error('Failed to load committee data:', error);
    } finally {
      setLoading(false);
    }
  };

  // A member is hidden when manually deactivated by admin OR when their
  // (possibly extended) term has passed its total duration.
  const isMemberActive = (m) => {
    if (m.active === false) return false;
    if (!m.electionDate) return true;
    const years = (m.termYears || 5) + (m.extended ? 1 : 0);
    const election = new Date(m.electionDate);
    const termEnd = new Date(election);
    termEnd.setFullYear(termEnd.getFullYear() + years);
    return new Date() <= termEnd;
  };

  const activeMembers = allMembers.filter(isMemberActive);

  const matchSearch = (m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    const haystack = [
      m.name, m.nameEn, m.nameNe,
      m.role, m.roleEn, m.roleNe,
      m.district, m.districtEn, m.districtNe,
      m.province, m.provinceEn, m.provinceNe,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  };

  const searchResults = searchQuery.trim() ? activeMembers.filter(matchSearch) : [];

  const getMembersBySection = (section) =>
    activeMembers.filter(m => m.section === section).sort((a, b) => (a.order || 0) - (b.order || 0));

  const getMembersByProvince = (provinceNumber) =>
    activeMembers.filter(m => m.section === 'districtCommittee' && m.provinceNumber === provinceNumber)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleShow = (key) => setShowAll(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleProvince = (num) => setExpandedProvinces(prev => ({ ...prev, [num]: !prev[num] }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <Loader label={t('sections.loadingCommittee')} />
      </section>
    );
  }

  const getName = (m) => ({ en: m.nameEn || m.name || m.nameNe || '', ne: m.nameNe || m.nameEn || m.name || '' });
  const getRole = (m) => ({ en: m.roleEn || m.role || m.roleNe || '', ne: m.roleNe || m.roleEn || m.role || '' });

  const renderMemberCard = (member, index) => {
    const name = getName(member);
    const role = getRole(member);
    const displayName = isNepali ? (name.ne || name.en) : (name.en || name.ne);
    return (
      <motion.button
        key={member._id || index}
        variants={cardVariants}
        onClick={() => setSelectedMember(member)}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.97 }}
        className="group w-full text-left bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold border border-gray-100"
      >
        {/* Clear photo on top (not blurred by overlay) */}
        <div className="relative overflow-hidden bg-army-dark aspect-square">
          {member.image ? (
            <img
              src={member.image}
              alt={name.en || member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
              loading="lazy"
            />
          ) : null}
          {!member.image && (
            <div className="flex flex-col items-center justify-center h-full w-full text-white/80 bg-gradient-to-br from-army via-army-dark to-[#142b1d]">
              <UserRound className="h-16 w-16 md:h-20 md:w-20 text-gold/70" strokeWidth={1.2} />
              <span className="mt-2 max-w-[80%] truncate text-xs md:text-sm font-semibold text-white/70">
                {isNepali ? (name.ne || name.en) : (name.en || name.ne)}
              </span>
            </div>
          )}
        </div>

        {/* Name clearly below the photo */}
        <div className="p-3 md:p-4 text-left">
          <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide mb-1.5 ${ROLE_COLORS[index % ROLE_COLORS.length]}`}>
            {isNepali ? (role.ne || role.en) : (role.en || role.ne)}
          </span>
          <h3 className="text-army font-semibold text-sm md:text-base leading-snug break-words">{displayName}</h3>
          {(member.districtEn || member.provinceEn) && (
            <p className="text-gray-600 text-xs md:text-sm font-bold flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate">{isNepali ? (member.districtNe || member.districtEn || member.provinceEn) : (member.districtEn || member.districtNe || member.provinceEn)}</span>
            </p>
          )}
        </div>
      </motion.button>
    );
  };

  const renderProvinceSection = (sectionConfig) => {
    const members = getMembersBySection(sectionConfig.key);
    if (members.length === 0) return null;
    const isExpanded = showAll[sectionConfig.key] !== false;
    const title = isNepali ? sectionConfig.labelNe : sectionConfig.labelEn;

    return (
      <motion.div
        key={sectionConfig.key}
        className="mb-14 last:mb-0"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-army">{title}</h2>
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{members.length}</span>
        </div>

        {[1, 2, 3, 4, 5, 6, 7].map(provNum => {
          const provMembers = getMembersByProvince(provNum);
          if (provMembers.length === 0) return null;
          const provName = isNepali ? PROVINCE_NAMES[provNum].ne : PROVINCE_NAMES[provNum].en;
          const isProvExpanded = expandedProvinces[provNum];
          return (
            <div key={provNum} className="mb-8">
              {/* Bigger province name */}
              <button onClick={() => toggleProvince(provNum)} className="flex items-center gap-2.5 mb-4 text-left group/prov">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0" />
                <h3 className="font-display text-xl md:text-2xl font-bold text-army group-hover/prov:text-gold-dark transition-colors break-words">
                  {provName}
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{provMembers.length}</span>
                {isProvExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </button>
              <AnimatePresence>
                {(isProvExpanded || isExpanded) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                      {provMembers.map((member, idx) => renderMemberCard(member, idx))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    );
  };

  const renderRegularSection = (sectionConfig) => {
    const members = getMembersBySection(sectionConfig.key);
    if (members.length === 0) return null;
    const isExpanded = showAll[sectionConfig.key] !== false;
    const displayMembers = isExpanded ? members : members.slice(0, 8);
    const hasMore = !isExpanded && members.length > 8;
    const title = isNepali ? sectionConfig.labelNe : sectionConfig.labelEn;

    return (
      <motion.div
        key={sectionConfig.key}
        className="mb-14 last:mb-0"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-army">{title}</h2>
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{members.length}</span>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayMembers.map((member, idx) => renderMemberCard(member, idx))}
          </div>
        </motion.div>

        {hasMore && (
          <motion.div className="text-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggleShow(sectionConfig.key)}
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-full hover:bg-gold-dark transition-all shadow-md text-sm font-medium">
              <ChevronDown className="h-4 w-4" />
              {t('sections.viewAll')} ({members.length})
            </motion.button>
          </motion.div>
        )}

        {isExpanded && members.length > 8 && (
          <motion.div className="text-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggleShow(sectionConfig.key)}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-300 transition-all text-sm font-medium">
              <ChevronUp className="h-4 w-4" />
              {t('sections.showLess')}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.section className="py-20 bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-army break-words leading-[1.3]">
              {isNepali ? 'केन्द्रीय कार्यसमिति' : <>Central Executive<br className="md:hidden" /> Committee</>}
            </h1>
            <p className="text-gray-600 mt-4 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {isNepali ? 'नेपाल राष्ट्रिय भूतपूर्व सैनिक संघको नेतृत्व टोली' : 'Leadership Team of Nepal National Ex-Army Association'}
            </p>
            <motion.div className="w-20 h-1 bg-gold mx-auto mt-4 rounded-full" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.8, delay: 0.3 }} />
          </motion.div>

          {SECTION_CONFIG.map(sc => sc.key === 'districtCommittee' ? renderProvinceSection(sc) : renderRegularSection(sc))}

          {activeMembers.length === 0 && (
            <motion.div className="text-center py-16 text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg">{t('sections.noCommitteeMembers')}</p>
            </motion.div>
          )}
        </div>
      </Container>

      {/* ─── Profile Details Modal ─── */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            {/* Bottom sheet on mobile, centered dialog on desktop */}
            <motion.div
              className="bg-white w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl rounded-t-3xl sm:rounded-3xl"
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo header - full photo, no crop */}
              <div className="relative bg-army-dark flex items-center justify-center h-64 sm:h-80 overflow-hidden">
                {selectedMember.image ? (
                  <img
                    src={selectedMember.image}
                    alt={getName(selectedMember).en}
                    className="max-h-full max-w-full object-contain p-4"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : null}
                {!selectedMember.image && (
                  <div className="flex flex-col items-center justify-center h-full w-full text-white/80">
                    <UserRound className="h-24 w-24 text-gold/70" strokeWidth={1.2} />
                    <span className="mt-3 text-lg font-semibold text-white/70 px-4 text-center">
                      {getName(selectedMember).en}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Name + role banner */}
              <div className="bg-gradient-to-r from-army to-army-dark text-center px-6 py-5">
                <span className="inline-flex items-center gap-1.5 bg-gold text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {isNepali ? (getRole(selectedMember).ne || getRole(selectedMember).en) : (getRole(selectedMember).en || getRole(selectedMember).ne)}
                </span>
                <h3 className="font-display text-2xl font-bold leading-tight break-words text-white">
                  {isNepali ? (getName(selectedMember).ne || getName(selectedMember).en) : (getName(selectedMember).en || getName(selectedMember).ne)}
                </h3>
              </div>

              {/* Details */}
              <div className="p-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {isNepali ? 'विवरण' : 'Details'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoItem label={isNepali ? 'नाम' : 'Name'}
                    value={isNepali ? (getName(selectedMember).ne || getName(selectedMember).en) : (getName(selectedMember).en || getName(selectedMember).ne)} />
                  <InfoItem label={isNepali ? 'पद' : 'Role'}
                    value={isNepali ? (getRole(selectedMember).ne || getRole(selectedMember).en) : (getRole(selectedMember).en || getRole(selectedMember).ne)} />
                  {selectedMember.provinceNumber > 0 && (
                    <InfoItem label={isNepali ? 'प्रदेश' : 'Province'}
                      value={PROVINCE_NAMES[selectedMember.provinceNumber]?.[isNepali ? 'ne' : 'en'] || selectedMember.provinceEn || selectedMember.province} />
                  )}
                  {(selectedMember.districtEn || selectedMember.districtNe || selectedMember.district) && (
                    <InfoItem label={isNepali ? 'जिल्ला' : 'District'}
                      value={isNepali ? (selectedMember.districtNe || selectedMember.districtEn || selectedMember.district) : (selectedMember.districtEn || selectedMember.districtNe || selectedMember.district)} />
                  )}
                  {selectedMember.electionDate && (
                    <InfoItem label={isNepali ? 'निर्वाचन मिति' : 'Election Date'}
                      value={new Date(selectedMember.electionDate).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
                  )}
                  {selectedMember.termYears && (
                    <InfoItem label={isNepali ? 'कार्यकाल' : 'Term'}
                      value={`${selectedMember.termYears} ${isNepali ? 'वर्ष' : 'years'}${selectedMember.extended ? ` (${isNepali ? 'विस्तारित' : 'Extended'})` : ''}`} />
                  )}
                </div>

                {getBio(selectedMember) && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{isNepali ? 'जीवनी' : 'Biography'}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed break-words">{getBio(selectedMember)}</p>
                  </div>
                )}

                <button onClick={() => setSelectedMember(null)} className="w-full mt-5 py-3 bg-gold text-white font-medium rounded-xl hover:bg-gold-dark transition-colors">
                  {isNepali ? 'बन्द गर्नुहोस्' : 'Close'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

/* InfoItem WITHOUT icons - clean text labels */
const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 break-words leading-snug">{value}</p>
  </div>
);

const getBio = (m) => (m.bioEn || m.bioNe || m.bio || '');

export default CentralCommittee;
