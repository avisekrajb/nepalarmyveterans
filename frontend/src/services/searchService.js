import { 
  newsAPI, 
  eventsAPI, 
  noticesAPI, 
  galleryAPI, 
  leadershipAPI, 
  centralCommitteeAPI,
  introductionAPI,
  contactAPI,
  interviewAPI,
  heroAPI
} from './api';

const matchField = (value, searchTerm) => {
  if (!value) return false;
  return value.toLowerCase().includes(searchTerm);
};

export const searchAllContent = async (query) => {
  try {
    const results = [];
    const searchTerm = query.toLowerCase().trim();

    console.log('🔍 Searching for:', searchTerm);

    if (!searchTerm) {
      return [];
    }

    const [
      newsRes,
      eventsRes,
      noticesRes,
      galleryRes,
      leadershipRes,
      committeeRes,
      introductionRes,
      contactRes,
      interviewRes,
      heroRes,
    ] = await Promise.all([
      newsAPI.getNews().catch(err => ({ data: [] })),
      eventsAPI.getEvents().catch(err => ({ data: [] })),
      noticesAPI.getNotices().catch(err => ({ data: [] })),
      galleryAPI.getGallery().catch(err => ({ data: [] })),
      leadershipAPI.getLeadership().catch(err => ({ data: [] })),
      centralCommitteeAPI.getMembers().catch(err => ({ data: { members: [] } })),
      introductionAPI.getIntroduction().catch(err => ({ data: { title: '', content: '' } })),
      contactAPI.getContact().catch(err => ({ data: { address: '', phone: '', email: '' } })),
      interviewAPI.getInterviews().catch(err => ({ data: [] })),
      heroAPI.getHero().catch(err => ({ data: { seniors: [], carouselImages: [] } })),
    ]);

    console.log('📊 API Responses:', {
      news: newsRes.data?.length || 0,
      events: eventsRes.data?.length || 0,
      notices: noticesRes.data?.length || 0,
      gallery: galleryRes.data?.length || 0,
      leadership: leadershipRes.data?.length || 0,
      committee: committeeRes.data?.members?.length || 0,
      interviews: interviewRes.data?.length || 0,
      heroSeniors: heroRes.data?.seniors?.length || 0,
    });

    // ============================================================
    // 1. SEARCH IN NEWS
    // ============================================================
    const news = newsRes.data || [];
    news.forEach(item => {
      const titleMatch = matchField(item.titleEn, searchTerm) || matchField(item.titleNe, searchTerm) || matchField(item.title, searchTerm);
      const contentMatch = matchField(item.contentEn, searchTerm) || matchField(item.contentNe, searchTerm) || matchField(item.content, searchTerm);
      if (titleMatch || contentMatch) {
        results.push({
          id: item._id,
          title: item.titleEn || item.title || item.titleNe || 'Untitled',
          content: item.contentEn || item.content || item.contentNe || '',
          image: item.image || '',
          category: 'News',
          link: `/news`,
          date: item.date || item.createdAt,
          type: 'news',
          match: titleMatch ? 'title' : 'content',
        });
      }
    });

    // ============================================================
    // 2. SEARCH IN EVENTS
    // ============================================================
    const events = eventsRes.data || [];
    events.forEach(item => {
      const titleMatch = matchField(item.titleEn, searchTerm) || matchField(item.titleNe, searchTerm) || matchField(item.title, searchTerm);
      const descMatch = matchField(item.descriptionEn, searchTerm) || matchField(item.descriptionNe, searchTerm) || matchField(item.description, searchTerm);
      const locationMatch = matchField(item.locationEn, searchTerm) || matchField(item.locationNe, searchTerm) || matchField(item.location, searchTerm);
      if (titleMatch || descMatch || locationMatch) {
        results.push({
          id: item._id,
          title: item.titleEn || item.title || item.titleNe || 'Untitled',
          content: item.descriptionEn || item.description || item.descriptionNe || '',
          image: item.image || '',
          category: 'Events',
          link: `/events`,
          date: item.date || item.createdAt,
          type: 'events',
          match: titleMatch ? 'title' : (descMatch ? 'description' : 'location'),
        });
      }
    });

    // ============================================================
    // 3. SEARCH IN NOTICES
    // ============================================================
    const notices = noticesRes.data || [];
    notices.forEach(item => {
      const titleMatch = matchField(item.titleEn, searchTerm) || matchField(item.titleNe, searchTerm) || matchField(item.title, searchTerm);
      const contentMatch = matchField(item.contentEn, searchTerm) || matchField(item.contentNe, searchTerm) || matchField(item.content, searchTerm);
      if (titleMatch || contentMatch) {
        results.push({
          id: item._id,
          title: item.titleEn || item.title || item.titleNe || 'Untitled',
          content: item.contentEn || item.content || item.contentNe || '',
          image: item.image || '',
          category: 'Notices',
          link: `/notices`,
          date: item.date || item.createdAt,
          type: 'notices',
          match: titleMatch ? 'title' : 'content',
        });
      }
    });

    // ============================================================
    // 4. SEARCH IN GALLERY
    // ============================================================
    const gallery = galleryRes.data || [];
    gallery.forEach(item => {
      const titleMatch = item.title?.toLowerCase().includes(searchTerm);
      if (titleMatch) {
        results.push({
          id: item._id,
          title: item.title || 'Gallery Image',
          content: 'Gallery Image',
          image: item.url || '',
          category: 'Gallery',
          link: `/gallery`,
          date: item.createdAt,
          type: 'gallery',
          match: 'title',
        });
      }
    });

    // ============================================================
    // 5. SEARCH IN LEADERSHIP
    // ============================================================
    const leadership = leadershipRes.data || [];
    leadership.forEach(item => {
      const nameMatch = matchField(item.nameEn, searchTerm) || matchField(item.nameNe, searchTerm) || matchField(item.name, searchTerm);
      const roleMatch = matchField(item.roleEn, searchTerm) || matchField(item.roleNe, searchTerm) || matchField(item.role, searchTerm);
      const bioMatch = matchField(item.bioEn, searchTerm) || matchField(item.bioNe, searchTerm) || matchField(item.bio, searchTerm);
      if (nameMatch || roleMatch || bioMatch) {
        const roleDisplay = item.roleEn || item.role || item.roleNe || '';
        const bioDisplay = item.bioEn || item.bio || item.bioNe || '';
        results.push({
          id: item._id,
          title: item.nameEn || item.name || item.nameNe || 'Untitled',
          content: `${roleDisplay} - ${bioDisplay}`,
          image: item.image || '',
          category: 'Leadership',
          link: `/leadership`,
          date: item.createdAt,
          type: 'leadership',
          match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
        });
      }
    });

    // ============================================================
    // 6. SEARCH IN INTERVIEWS
    // ============================================================
    const interviews = interviewRes.data || [];
    interviews.forEach(item => {
      const titleMatch = matchField(item.titleEn, searchTerm) || matchField(item.titleNe, searchTerm) || matchField(item.title, searchTerm);
      const contentMatch = matchField(item.contentEn, searchTerm) || matchField(item.contentNe, searchTerm) || matchField(item.content, searchTerm);
      const guestMatch = matchField(item.guestEn, searchTerm) || matchField(item.guestNe, searchTerm) || matchField(item.guest, searchTerm);
      if (titleMatch || contentMatch || guestMatch) {
        results.push({
          id: item._id,
          title: item.titleEn || item.title || item.titleNe || 'Untitled',
          content: item.contentEn || item.content || item.contentNe || '',
          image: item.image || '',
          category: 'Interviews',
          link: `/interviews`,
          date: item.date || item.createdAt,
          type: 'interviews',
          match: titleMatch ? 'title' : (guestMatch ? 'guest' : 'content'),
        });
      }
    });

    // ============================================================
    // 7. SEARCH IN CENTRAL COMMITTEE
    // ============================================================
    const committeeData = committeeRes.data || { members: [] };
    
    const searchCommitteeMembers = (members, category, sectionName) => {
      if (!Array.isArray(members)) return;
      members.forEach(item => {
        const nameMatch = matchField(item.nameEn, searchTerm) || matchField(item.nameNe, searchTerm) || matchField(item.name, searchTerm);
        const roleMatch = matchField(item.roleEn, searchTerm) || matchField(item.roleNe, searchTerm) || matchField(item.role, searchTerm);
        const bioMatch = matchField(item.bioEn, searchTerm) || matchField(item.bioNe, searchTerm) || matchField(item.bio, searchTerm);
        if (nameMatch || roleMatch || bioMatch) {
          const roleDisplay = item.roleEn || item.role || item.roleNe || '';
          const bioDisplay = item.bioEn || item.bio || item.bioNe || '';
          results.push({
            id: item._id || `committee-${Date.now()}`,
            title: item.nameEn || item.name || item.nameNe || 'Untitled',
            content: `${roleDisplay} - ${bioDisplay}`,
            image: item.image || '',
            category: category,
            link: `/central-committee`,
            date: item.createdAt,
            type: 'committee',
            match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
            section: sectionName,
          });
        }
      });
    };

    if (Array.isArray(committeeData)) {
      searchCommitteeMembers(committeeData, 'Central Committee', 'Members');
    } else if (committeeData.members && Array.isArray(committeeData.members)) {
      searchCommitteeMembers(committeeData.members, 'Central Committee', 'Members');
    } else if (typeof committeeData === 'object') {
      const sections = {
        'members': 'Central Committee',
        'districtMembers': 'District Committee',
        'regionalMembers': 'Regional Committee',
        'unitMembers': 'Unit Committee',
        'provincialMembers': 'Provincial Coordinators',
        'centralMembers': 'Central Members',
        'advisoryMembers': 'Advisory Council'
      };
      Object.keys(sections).forEach(sectionKey => {
        const sectionData = committeeData[sectionKey];
        if (Array.isArray(sectionData)) {
          searchCommitteeMembers(sectionData, sections[sectionKey], sectionKey);
        }
      });
    }

    // ============================================================
    // 8. SEARCH IN INTRODUCTION
    // ============================================================
    const introData = introductionRes.data || {};
    if (introData.title || introData.content) {
      const titleMatch = matchField(introData.title, searchTerm);
      const contentMatch = matchField(introData.content, searchTerm);
      if (titleMatch || contentMatch) {
        results.push({
          id: 'introduction',
          title: introData.title || 'Introduction',
          content: introData.content || '',
          image: introData.image || '',
          category: 'About Us',
          link: `/introduction`,
          date: new Date().toISOString(),
          type: 'introduction',
          match: titleMatch ? 'title' : 'content',
        });
      }
    }

    // ============================================================
    // 9. SEARCH IN CONTACT
    // ============================================================
    const contactData = contactRes.data || {};
    if (contactData.address || contactData.phone || contactData.email) {
      const addressMatch = contactData.address?.toLowerCase().includes(searchTerm);
      const phoneMatch = contactData.phone?.toLowerCase().includes(searchTerm);
      const emailMatch = contactData.email?.toLowerCase().includes(searchTerm);
      if (addressMatch || phoneMatch || emailMatch) {
        results.push({
          id: 'contact',
          title: 'Contact Information',
          content: `${contactData.address || ''} ${contactData.phone || ''} ${contactData.email || ''}`,
          image: '',
          category: 'Contact',
          link: `/contact`,
          date: new Date().toISOString(),
          type: 'contact',
          match: addressMatch ? 'address' : (phoneMatch ? 'phone' : 'email'),
        });
      }
    }

    // ============================================================
    // 10. SEARCH IN HERO (Seniors)
    // ============================================================
    const heroData = heroRes.data || {};
    const seniors = heroData.seniors || [];
    seniors.forEach(item => {
      const nameMatch = matchField(item.nameEn, searchTerm) || matchField(item.nameNe, searchTerm) || matchField(item.name, searchTerm);
      const roleMatch = matchField(item.roleEn, searchTerm) || matchField(item.roleNe, searchTerm) || matchField(item.role, searchTerm);
      if (nameMatch || roleMatch) {
        const roleDisplay = item.roleEn || item.role || item.roleNe || '';
        results.push({
          id: item._id || `senior-${Date.now()}`,
          title: item.nameEn || item.name || item.nameNe || 'Senior Member',
          content: roleDisplay,
          image: item.image || '',
          category: 'Seniors',
          link: `/`,
          date: new Date().toISOString(),
          type: 'senior',
          match: nameMatch ? 'name' : 'role',
        });
      }
    });

    // ============================================================
    // 11. SEARCH IN HERO (Carousel Images)
    // ============================================================
    const carouselImages = heroData.carouselImages || [];
    carouselImages.forEach((item, index) => {
      const altMatch = item.alt?.toLowerCase().includes(searchTerm);
      if (altMatch) {
        results.push({
          id: `carousel-${index}`,
          title: `Carousel Image ${index + 1}`,
          content: item.alt || '',
          image: item.url || '',
          category: 'Gallery',
          link: `/`,
          date: new Date().toISOString(),
          type: 'carousel',
          match: 'alt',
        });
      }
    });

    // ============================================================
    // 12. REMOVE DUPLICATES
    // ============================================================
    const uniqueResults = [];
    const seen = new Set();
    results.forEach(item => {
      const key = `${item.title}-${item.link}-${item.category}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(item);
      }
    });

    console.log(`✅ Total unique results found: ${uniqueResults.length}`);

    // ============================================================
    // 13. SORT RESULTS BY RELEVANCE
    // ============================================================
    uniqueResults.sort((a, b) => {
      const aTitle = a.title?.toLowerCase() || '';
      const bTitle = b.title?.toLowerCase() || '';
      
      if (aTitle === searchTerm && bTitle !== searchTerm) return -1;
      if (bTitle === searchTerm && aTitle !== searchTerm) return 1;
      
      if (aTitle.startsWith(searchTerm) && !bTitle.startsWith(searchTerm)) return -1;
      if (bTitle.startsWith(searchTerm) && !aTitle.startsWith(searchTerm)) return 1;
      
      if (aTitle.includes(searchTerm) && !bTitle.includes(searchTerm)) return -1;
      if (bTitle.includes(searchTerm) && !aTitle.includes(searchTerm)) return 1;
      
      const matchPriority = { 'title': 0, 'name': 1, 'content': 2, 'description': 3, 'role': 4, 'address': 5, 'phone': 6, 'email': 7 };
      const aPriority = matchPriority[a.match] || 99;
      const bPriority = matchPriority[b.match] || 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      return 0;
    });

    return uniqueResults;
  } catch (error) {
    console.error('❌ Search error:', error);
    return [];
  }
};

export default searchAllContent;
