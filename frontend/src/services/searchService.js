import { newsAPI, eventsAPI, noticesAPI, galleryAPI, leadershipAPI, centralCommitteeAPI } from './api';

// Search all content across the website
export const searchAllContent = async (query) => {
  try {
    const results = [];
    const searchTerm = query.toLowerCase().trim();

    console.log('Searching for:', searchTerm);

    if (!searchTerm) {
      return [];
    }

    // Fetch all data in parallel
    const [
      newsRes,
      eventsRes,
      noticesRes,
      galleryRes,
      leadershipRes,
      committeeRes,
    ] = await Promise.all([
      newsAPI.getNews().catch(err => ({ data: [] })),
      eventsAPI.getEvents().catch(err => ({ data: [] })),
      noticesAPI.getNotices().catch(err => ({ data: [] })),
      galleryAPI.getGallery().catch(err => ({ data: [] })),
      leadershipAPI.getLeadership().catch(err => ({ data: [] })),
      centralCommitteeAPI.getMembers().catch(err => ({ data: { members: [] } })),
    ]);

    console.log('API Responses:', {
      news: newsRes.data?.length || 0,
      events: eventsRes.data?.length || 0,
      notices: noticesRes.data?.length || 0,
      gallery: galleryRes.data?.length || 0,
      leadership: leadershipRes.data?.length || 0,
      committee: committeeRes.data?.members?.length || 0,
    });

    // Search in News
    const news = newsRes.data || [];
    news.forEach(item => {
      const titleMatch = item.title?.toLowerCase().includes(searchTerm);
      const contentMatch = item.content?.toLowerCase().includes(searchTerm);
      if (titleMatch || contentMatch) {
        results.push({
          id: item._id,
          title: item.title || 'Untitled',
          content: item.content || '',
          image: item.image || '',
          category: 'News',
          link: `/news`,
          date: item.date,
          type: 'news',
          match: titleMatch ? 'title' : 'content',
        });
      }
    });

    // Search in Events
    const events = eventsRes.data || [];
    events.forEach(item => {
      const titleMatch = item.title?.toLowerCase().includes(searchTerm);
      const descMatch = item.description?.toLowerCase().includes(searchTerm);
      if (titleMatch || descMatch) {
        results.push({
          id: item._id,
          title: item.title || 'Untitled',
          content: item.description || '',
          image: item.image || '',
          category: 'Events',
          link: `/events`,
          date: item.date,
          type: 'events',
          match: titleMatch ? 'title' : 'content',
        });
      }
    });

    // Search in Notices
    const notices = noticesRes.data || [];
    notices.forEach(item => {
      const titleMatch = item.title?.toLowerCase().includes(searchTerm);
      const contentMatch = item.content?.toLowerCase().includes(searchTerm);
      if (titleMatch || contentMatch) {
        results.push({
          id: item._id,
          title: item.title || 'Untitled',
          content: item.content || '',
          image: item.image || '',
          category: 'Notices',
          link: `/notices`,
          date: item.date,
          type: 'notices',
          match: titleMatch ? 'title' : 'content',
        });
      }
    });

    // Search in Gallery
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

    // Search in Leadership
    const leadership = leadershipRes.data || [];
    leadership.forEach(item => {
      const nameMatch = item.name?.toLowerCase().includes(searchTerm);
      const roleMatch = item.role?.toLowerCase().includes(searchTerm);
      const bioMatch = item.bio?.toLowerCase().includes(searchTerm);
      if (nameMatch || roleMatch || bioMatch) {
        results.push({
          id: item._id,
          title: item.name || 'Untitled',
          content: `${item.role || ''} - ${item.bio || ''}`,
          image: item.image || '',
          category: 'Leadership',
          link: `/leadership`,
          date: item.createdAt,
          type: 'leadership',
          match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
        });
      }
    });

    // Search in Central Committee - Handle different data structures
    const committeeData = committeeRes.data || { members: [] };
    
    // Case 1: If data is an array directly
    if (Array.isArray(committeeData)) {
      committeeData.forEach(item => {
        const nameMatch = item.name?.toLowerCase().includes(searchTerm);
        const roleMatch = item.role?.toLowerCase().includes(searchTerm);
        const bioMatch = item.bio?.toLowerCase().includes(searchTerm);
        if (nameMatch || roleMatch || bioMatch) {
          results.push({
            id: item._id || `committee-${Date.now()}`,
            title: item.name || 'Untitled',
            content: `${item.role || ''} - ${item.bio || ''}`,
            image: item.image || '',
            category: 'Central Committee',
            link: `/central-committee`,
            date: item.createdAt,
            type: 'committee',
            match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
          });
        }
      });
    } 
    // Case 2: If data has members array
    else if (committeeData.members && Array.isArray(committeeData.members)) {
      committeeData.members.forEach(item => {
        const nameMatch = item.name?.toLowerCase().includes(searchTerm);
        const roleMatch = item.role?.toLowerCase().includes(searchTerm);
        const bioMatch = item.bio?.toLowerCase().includes(searchTerm);
        if (nameMatch || roleMatch || bioMatch) {
          results.push({
            id: item._id || `committee-${Date.now()}`,
            title: item.name || 'Untitled',
            content: `${item.role || ''} - ${item.bio || ''}`,
            image: item.image || '',
            category: 'Central Committee',
            link: `/central-committee`,
            date: item.createdAt,
            type: 'committee',
            match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
          });
        }
      });
    }
    // Case 3: Search in all possible committee sections
    else if (typeof committeeData === 'object') {
      const sections = ['members', 'districtMembers', 'regionalMembers', 'unitMembers', 'provincialMembers', 'centralMembers', 'advisoryMembers'];
      sections.forEach(sectionKey => {
        const sectionData = committeeData[sectionKey];
        if (Array.isArray(sectionData)) {
          sectionData.forEach(item => {
            const nameMatch = item.name?.toLowerCase().includes(searchTerm);
            const roleMatch = item.role?.toLowerCase().includes(searchTerm);
            const bioMatch = item.bio?.toLowerCase().includes(searchTerm);
            if (nameMatch || roleMatch || bioMatch) {
              // Get section name for category
              const sectionNames = {
                'members': 'Central Committee',
                'districtMembers': 'District Committee',
                'regionalMembers': 'Regional Committee',
                'unitMembers': 'Unit Committee',
                'provincialMembers': 'Provincial Coordinators',
                'centralMembers': 'Central Members',
                'advisoryMembers': 'Advisory Council'
              };
              results.push({
                id: item._id || `committee-${Date.now()}-${sectionKey}`,
                title: item.name || 'Untitled',
                content: `${item.role || ''} - ${item.bio || ''}`,
                image: item.image || '',
                category: sectionNames[sectionKey] || 'Central Committee',
                link: `/central-committee`,
                date: item.createdAt,
                type: 'committee',
                match: nameMatch ? 'name' : (roleMatch ? 'role' : 'bio'),
              });
            }
          });
        }
      });
    }

    console.log('Total results found:', results.length);

    // Sort results by relevance
    results.sort((a, b) => {
      // Title matches first
      if (a.match === 'title' && b.match !== 'title') return -1;
      if (b.match === 'title' && a.match !== 'title') return 1;
      
      // Then name matches
      if (a.match === 'name' && b.match !== 'name') return -1;
      if (b.match === 'name' && a.match !== 'name') return 1;
      
      return 0;
    });

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export default searchAllContent;