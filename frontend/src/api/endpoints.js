import { apiClient } from './client';

export const api = {
  auth: {
    login: (credentials) => apiClient.post('/api/auth/login', credentials).then(res => res.data),
    signup: (userData) => apiClient.post('/api/auth/signup', userData).then(res => res.data),
    getMe: () => apiClient.get('/api/auth/me').then(res => res.data.data),
  },
  feedback: {
    getAll: () => apiClient.get('/api/feedback').then(res => res.data.data),
    submit: (data) => apiClient.post('/api/feedback', data).then(res => res.data.data),
    getShortlist: () => apiClient.get('/api/feedback/shortlist').then(res => res.data.data),
    getClusters: () => apiClient.get('/api/feedback/clusters').then(res => res.data.data),
    getTrend: () => apiClient.get('/api/feedback/trend').then(res => res.data.data),
  },
  summary: {
    generate: (data) => apiClient.post('/api/summary/generate', data).then(res => res.data),
  }
};
