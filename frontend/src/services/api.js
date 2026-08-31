import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://nepalarmyveteransbackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  },
};

// ==================== HERO API ====================
export const heroAPI = {
  getHero: () => api.get('/hero'),
  updateHero: (data) => api.put('/hero', data),
  saveContent: (content) => api.put('/hero', { content }),
  uploadCarouselImage: (formData) => {
    return api.post('/hero/carousel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteCarouselImage: (index) => api.delete(`/hero/carousel/${index}`),
  updateCarouselImage: (index, data) => api.put(`/hero/carousel/${index}`, data),
  addSenior: (formData) => {
    return api.post('/hero/seniors', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteSenior: (index) => api.delete(`/hero/seniors/${index}`),
  updateSenior: (index, formData) => {
    return api.put(`/hero/seniors/${index}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ==================== LEADERSHIP API ====================
export const leadershipAPI = {
  getLeadership: () => api.get('/leadership'),
  createLeader: (formData) => {
    return api.post('/leadership', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateLeader: (id, formData) => {
    return api.put(`/leadership/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteLeader: (id) => api.delete(`/leadership/${id}`),
};

// ==================== CENTRAL COMMITTEE API ====================
export const centralCommitteeAPI = {
  getAll: () => api.get('/central-committee'),
  getMembers: (params) => api.get('/central-committee/search', { params }),
  getProvinces: () => api.get('/central-committee/provinces'),
  getDistricts: (provinceNumber) => api.get(`/central-committee/districts/${provinceNumber}`),
  addMember: (formData) => {
    return api.post('/central-committee', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateMember: (id, formData) => {
    return api.put(`/central-committee/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteMember: (id) => api.delete(`/central-committee/${id}`),
  extendTerm: (id) => api.put(`/central-committee/${id}/extend`),
  removeExtension: (id) => api.put(`/central-committee/${id}/extend/remove`),
  toggleActive: (id, active) => api.put(`/central-committee/${id}`, { active }),
  updateOrder: (members) => api.put('/central-committee/order/bulk', { members }),
};

// ==================== GALLERY API ====================
export const galleryAPI = {
  getGallery: () => api.get('/gallery'),
  uploadItem: (formData) => {
    return api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateItem: (id, formData) => {
    return api.put(`/gallery/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteItem: (id) => api.delete(`/gallery/${id}`),
};

// ==================== CONTACT API ====================
export const contactAPI = {
  getContact: () => api.get('/contact'),
  updateContact: (data) => api.put('/contact', data),
};

// ==================== CONTACT MESSAGES API ====================
export const contactMessageAPI = {
  getMessages: () => api.get('/contact-messages'),
  getMessage: (id) => api.get(`/contact-messages/${id}`),
  createMessage: (data) => api.post('/contact-messages', data),
  updateMessageStatus: (id, data) => api.put(`/contact-messages/${id}/status`, data),
  deleteMessage: (id) => api.delete(`/contact-messages/${id}`),
};

// ==================== INTRODUCTION API ====================
export const introductionAPI = {
  getIntroduction: () => api.get('/introduction'),
  updateIntroduction: (formData) => {
    return api.put('/introduction', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ==================== LOGO API ====================
export const logoAPI = {
  getHeaderLogos: () => api.get('/logos/header'),
  updateHeaderLogos: (data) => api.put('/logos/header', data),
  getFooterLogo: () => api.get('/logos/footer'),
  updateFooterLogo: (data) => api.put('/logos/footer', data),
};

// ==================== NEWS API ====================
export const newsAPI = {
  getNews: () => api.get('/news'),
  createNews: (formData) => {
    return api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateNews: (id, formData) => {
    return api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteNews: (id) => api.delete(`/news/${id}`),
};

// ==================== EVENTS API ====================
export const eventsAPI = {
  getEvents: () => api.get('/events'),
  createEvent: (formData) => {
    return api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateEvent: (id, formData) => {
    return api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// ==================== NOTICES API ====================
export const noticesAPI = {
  getNotices: () => api.get('/notices'),
  getModalNotice: () => api.get('/notices/modal'),
  getNotice: (id) => api.get(`/notices/${id}`),
  createNotice: (formData) => {
    return api.post('/notices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateNotice: (id, formData) => {
    return api.put(`/notices/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};

// ==================== TASK PROGRAMS API ====================
export const taskProgramAPI = {
  getTaskPrograms: () => api.get('/task-programs'),
  createTaskProgram: (data) => api.post('/task-programs', data),
  updateTaskProgram: (id, data) => api.put(`/task-programs/${id}`, data),
  deleteTaskProgram: (id) => api.delete(`/task-programs/${id}`),
};

// ==================== FAQS API ====================
export const faqAPI = {
  getFaqs: () => api.get('/faqs'),
  createFaq: (data) => api.post('/faqs', data),
  updateFaq: (id, data) => api.put(`/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/faqs/${id}`),
};

// ==================== FAQ CONFIG API ====================
export const faqConfigAPI = {
  getConfig: () => api.get('/faq-config'),
  updateConfig: (data) => api.put('/faq-config', data),
};

// ==================== TRAINING API ====================
export const trainingAPI = {
  getTrainings: () => api.get('/training'),
  createTraining: (data) => api.post('/training', data),
  updateTraining: (id, data) => api.put(`/training/${id}`, data),
  deleteTraining: (id) => api.delete(`/training/${id}`),
};

// ==================== SECURITY RULES API ====================
export const securityRulesAPI = {
  getSecurityRules: () => api.get('/security-rules'),
  createSecurityRule: (data) => api.post('/security-rules', data),
  updateSecurityRule: (id, data) => api.put(`/security-rules/${id}`, data),
  deleteSecurityRule: (id) => api.delete(`/security-rules/${id}`),
};

// ==================== INTERVIEWS API ====================
export const interviewAPI = {
  getInterviews: () => api.get('/interviews'),
  getInterview: (id) => api.get(`/interviews/${id}`),
  createInterview: (data) => {
    return api.post('/interviews', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateInterview: (id, data) => {
    return api.put(`/interviews/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteInterview: (id) => api.delete(`/interviews/${id}`),
};

// ==================== SETTINGS API ====================
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getMaintenance: () => api.get('/settings/maintenance'),
  updateMaintenance: (data) => api.put('/settings/maintenance', data),
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: () => api.get('/health'),
};

// ==================== TEAM API ====================
export const teamAPI = {
  getTeam: () => api.get('/team'),
  getTeamMember: (id) => api.get(`/team/${id}`),
  createTeam: (formData) => {
    return api.post('/team', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateTeam: (id, formData) => {
    return api.put(`/team/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteTeam: (id) => api.delete(`/team/${id}`),
  followTeamMember: (id) => api.post(`/team/${id}/follow`),
  unfollowTeamMember: (id) => api.post(`/team/${id}/unfollow`),
  getTeamFollowers: (id) => api.get(`/team/${id}/followers`),
  incrementTeamViews: (id) => api.post(`/team/${id}/view`),
};

// ==================== DONATION API ====================
export const donationAPI = {
  getDonations: () => api.get('/donations'),
  createDonation: (data) => api.post('/donations', data),
  updateDonationStatus: (id, status) => api.put(`/donations/${id}/status`, { status }),
  deleteDonation: (id) => api.delete(`/donations/${id}`),
};

// ==================== BOOKING API ====================
export const bookingAPI = {
  getBookings: () => api.get('/bookings'),
  createBooking: (data) => api.post('/bookings', data),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

// ==================== VISITOR API ====================
export const visitorAPI = {
  trackVisitor: (data) => api.post('/visitors/track', data),
  getVisitorStats: () => api.get('/visitors/stats'),
};

// ==================== SUBSCRIBE API ====================
export const subscribeAPI = {
  subscribe: (email) => api.post('/subscribe', { email }),
  unsubscribe: (email) => api.delete('/subscribe', { data: { email } }),
  getSubscribers: () => api.get('/subscribe'),
  deleteSubscriber: (id) => api.delete(`/subscribe/${id}`),
};

// ==================== PAYMENT API ====================
export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payment/create-intent', data),
  confirmPayment: (data) => api.post('/payment/confirm', data),
  getPaymentStatus: (id) => api.get(`/payment/status/${id}`),
};

// ==================== ABOUT API ====================
export const aboutAPI = {
  getAbout: () => api.get('/about'),
  updateAbout: (data) => api.put('/about', data),
};

// ==================== HISTORY API ====================
export const historyAPI = {
  getHistory: () => api.get('/history'),
  createHistory: (data) => api.post('/history', data),
  updateHistory: (id, data) => api.put(`/history/${id}`, data),
  deleteHistory: (id) => api.delete(`/history/${id}`),
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: () => api.get('/admin/dashboard/activity'),
  
  // Users
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Bookings
  getBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
  
  // Donations
  getDonations: () => api.get('/admin/donations'),
  updateDonationStatus: (id, status) => api.put(`/admin/donations/${id}/status`, { status }),
  deleteDonation: (id) => api.delete(`/admin/donations/${id}`),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Uploads
  uploadHero: (formData) => api.post('/admin/upload/hero', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadLogo: (formData) => api.post('/admin/upload/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadAbout: (formData) => api.post('/admin/upload/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadQR: (formData) => api.post('/admin/upload/qr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadTeam: (formData) => api.post('/admin/upload/team', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadHistory: (formData) => api.post('/admin/upload/history', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadHistoryBanner: (formData) => api.post('/admin/upload/history-banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadEvent: (formData) => api.post('/admin/upload/event', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadGallery: (formData) => api.post('/admin/upload/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadFooterImage: (formData) => api.post('/admin/upload/footer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadFooterVideo: (formData) => api.post('/admin/upload/footer/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadBookingBg: (formData) => api.post('/admin/upload/booking-bg', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Activity Logs
  getActivityLogs: () => api.get('/admin/activity'),
  clearActivityLogs: () => api.delete('/admin/activity'),
  getActivityStats: () => api.get('/admin/activity/stats'),
};

// ==================== CLOUDINARY API ====================
export const cloudinaryAPI = {
  getResources: () => api.get('/admin/cloud/resources'),
  getResource: (publicId) => api.get(`/admin/cloud/resource/${publicId}`),
  deleteResource: (publicId) => api.delete(`/admin/cloud/resource/${publicId}`),
  deleteMultipleResources: (ids) => api.post('/admin/cloud/resources/delete', { ids }),
  getStats: () => api.get('/admin/cloud/stats'),
  searchResources: (query) => api.get('/admin/cloud/search', { params: { query } }),
};

// ==================== BACKUP API ====================
export const backupAPI = {
  createBackup: () => api.post('/admin/backup'),
  getBackups: () => api.get('/admin/backup'),
  restoreBackup: (id) => api.post(`/admin/backup/restore/${id}`),
  deleteBackup: (id) => api.delete(`/admin/backup/${id}`),
};

// ==================== SUPER ADMIN API ====================
const superApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add super admin token to requests
superApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for super admin
superApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('superToken');
      localStorage.removeItem('superAdmin');
      window.location.href = '/superadmin/login';
    }
    return Promise.reject(error);
  }
);

export const superAdminAPI = {
  // Auth
  login: (email, password) => api.post('/superadmin/login', { email, password }),
  
  // Admin Management
  getAdmins: () => superApi.get('/superadmin/admins'),
  createAdmin: (data) => superApi.post('/superadmin/admins', data),
  deleteAdmin: (id) => superApi.delete(`/superadmin/admins/${id}`),
  
  // Logs & Analytics
  getLogs: (params) => superApi.get('/superadmin/logs', { params }),
  getAnalytics: (params) => superApi.get('/superadmin/analytics', { params }),
  
  // Cloudinary Management
  getCloudinaryImages: () => superApi.get('/superadmin/cloudinary'),
  deleteCloudinaryImage: (publicId) => superApi.delete(`/superadmin/cloudinary/${encodeURIComponent(publicId)}`),
  
  // Settings
  updateLogoSize: (data) => superApi.put('/superadmin/logo-size', data),
  addMaintenance: (data) => superApi.post('/superadmin/maintenance', data),
  getMaintenance: () => superApi.get('/superadmin/maintenance'),
};

export default api;
