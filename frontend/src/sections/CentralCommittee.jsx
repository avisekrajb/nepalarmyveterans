import React, { useState, useEffect } from 'react';
import { Container, Eyebrow } from '../components/ui/Section';
import { centralCommitteeAPI } from '../services/api';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CentralCommittee = () => {
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
  const [showAll, setShowAll] = useState({});

  const sections = [
    { key: 'members', label: 'केन्द्रीय कार्यसमिति', defaultShow: true },
    { key: 'districtMembers', label: 'जिल्ला कार्यसमिति', defaultShow: false },
    { key: 'regionalMembers', label: 'क्षेत्रीय सभापति', defaultShow: false },
    { key: 'unitMembers', label: 'इकाई सभापति', defaultShow: false },
    { key: 'provincialMembers', label: 'प्रदेश संयोजक', defaultShow: false },
    { key: 'centralMembers', label: 'केन्द्रीय सदस्य', defaultShow: false },
    { key: 'advisoryMembers', label: 'सलाहकार मण्डल', defaultShow: false },
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

  useEffect(() => {
    loadCommitteeData();
  }, []);

  const loadCommitteeData = async () => {
    try {
      const { data } = await centralCommitteeAPI.getMembers();
      setCommitteeData(data);
      // Initialize showAll state
      const initialShow = {};
      sections.forEach(s => {
        initialShow[s.key] = s.defaultShow;
      });
      setShowAll(initialShow);
    } catch (error) {
      console.error('Failed to load committee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = (key) => {
    setShowAll({ ...showAll, [key]: !showAll[key] });
  };

  const getSectionTitle = (key) => {
    const titleKey = sectionTitleMap[key];
    return committeeData[titleKey] || sections.find(s => s.key === key)?.label || '';
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </section>
    );
  }

  const renderMembers = (members, sectionKey) => {
    const displayMembers = showAll[sectionKey] ? members : members.slice(0, 8);
    const hasMore = members.length > 8;

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={member.image || 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo'}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x400/1F3D2B/FFFFFF?text=Photo';
                  }}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-army text-sm truncate">{member.name}</h3>
                <p className="text-xs text-gold-dark font-medium truncate">{member.role}</p>
                {member.bio && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={() => toggleShow(sectionKey)}
              className="inline-flex items-center gap-2 bg-gold text-white px-5 py-2 rounded-lg hover:bg-gold-dark transition-all"
            >
              {showAll[sectionKey] ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View All ({members.length})
                </>
              )}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
         
            <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
              {committeeData.title || 'केन्द्रीय कार्यसमिति'}
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Meet our dedicated leadership team across all levels of the organization.
            </p>
          </div>

          {sections.map((section) => {
            const members = committeeData[section.key] || [];
            if (members.length === 0) return null;

            const title = getSectionTitle(section.key);

            return (
              <div key={section.key} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display text-2xl font-bold text-army">{title}</h2>
                  <span className="text-sm text-gray-400">({members.length})</span>
                </div>
                {renderMembers(members, section.key)}
              </div>
            );
          })}

          {sections.every(s => (committeeData[s.key] || []).length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No committee members available.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CentralCommittee;