import axios, { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Sermons
  getSermons: (params?: any) => apiClient.get('/sermons', { params }),
  getSermon: (id: string) => apiClient.get(`/sermons/${id}`),
  createSermon: (data: any) => apiClient.post('/sermons', data),
  updateSermon: (id: string, data: any) => apiClient.put(`/sermons/${id}`, data),
  deleteSermon: (id: string) => apiClient.delete(`/sermons/${id}`),

  // Events
  getEvents: (params?: any) => apiClient.get('/events', { params }),
  getEvent: (id: string) => apiClient.get(`/events/${id}`),
  createEvent: (data: any) => apiClient.post('/events', data),
  updateEvent: (id: string, data: any) => apiClient.put(`/events/${id}`, data),
  deleteEvent: (id: string) => apiClient.delete(`/events/${id}`),
  registerEvent: (eventId: string, data: any) =>
    apiClient.post(`/events/${eventId}/register`, data),

  // Blog
  getBlogPosts: (params?: any) => apiClient.get('/blog', { params }),
  getBlogPost: (slug: string) => apiClient.get(`/blog/${slug}`),
  createBlogPost: (data: any) => apiClient.post('/blog', data),
  updateBlogPost: (id: string, data: any) => apiClient.put(`/blog/${id}`, data),
  deleteBlogPost: (id: string) => apiClient.delete(`/blog/${id}`),

  // Donations
  createDonation: (data: any) => apiClient.post('/donations', data),
  getDonations: (params?: any) => apiClient.get('/donations', { params }),

  // Ministries
  getMinistries: () => apiClient.get('/ministries'),
  getMinistry: (id: string) => apiClient.get(`/ministries/${id}`),
  createMinistry: (data: any) => apiClient.post('/ministries', data),
  updateMinistry: (id: string, data: any) => apiClient.put(`/ministries/${id}`, data),
  deleteMinistry: (id: string) => apiClient.delete(`/ministries/${id}`),

  // Settings
  getSettings: () => apiClient.get('/settings'),
  updateSettings: (data: any) => apiClient.put('/settings', data),

  // Users
  getUsers: () => apiClient.get('/users'),
  updateUser: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};
