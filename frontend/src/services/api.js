import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  uploadCarouselImage: (formData) => {
    return api.post('/hero/carousel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteCarouselImage: (index) => api.delete(`/hero/carousel/${index}`),
  addSenior: (data) => api.post('/hero/seniors', data),
  deleteSenior: (index) => api.delete(`/hero/seniors/${index}`),
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
  getMembers: () => api.get('/central-committee'),
  createMember: (formData) => {
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
};

// ==================== GALLERY API ====================
export const galleryAPI = {
  getGallery: () => api.get('/gallery'),
  uploadItem: (formData) => {
    return api.post('/gallery', formData, {
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

// ==================== INTERVIEWS API ====================
export const interviewAPI = {
  getInterviews: () => api.get('/interviews'),
  createInterview: (data) => api.post('/interviews', data),
  updateInterview: (id, data) => api.put(`/interviews/${id}`, data),
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
  deleteCloudinaryImage: (publicId) => superApi.delete(`/superadmin/cloudinary/${publicId}`),
  
  // Settings
  updateLogoSize: (data) => superApi.put('/superadmin/logo-size', data),
  addMaintenance: (data) => superApi.post('/superadmin/maintenance', data),
  getMaintenance: () => superApi.get('/superadmin/maintenance'),
};

export default api;