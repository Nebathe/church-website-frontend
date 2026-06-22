import axios from 'axios';

const API_URL = 'https://churchwebsite-ejss.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
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

// Sermon API calls
export const sermonAPI = {
  getAll: () => api.get('/sermons'),
  getOne: (id) => api.get(`/sermons/${id}`),
  create: (data) => api.post('/sermons', data),
  delete: (id) => api.delete(`/sermons/${id}`),
};

// Event API calls
export const eventAPI = {
  getAll: () => api.get('/events'),
  getOne: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Contact API calls
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Admin API calls
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  setup: () => api.post('/admin/setup'),
};

export default api;