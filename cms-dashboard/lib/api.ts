// ========================================
// CMS Dashboard - API Client
// ========================================

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  onUnauthorized?: () => void;
  onError?: (error: AxiosError) => void;
}

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Ajouter le token
  client.interceptors.request.use(
    (requestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Gérer les erreurs
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        config.onUnauthorized?.();
      }
      
      config.onError?.(error);
      return Promise.reject(error);
    }
  );

  return client;
};

// API Helper functions
const getData = (promise: Promise<AxiosResponse>) => promise.then(response => response.data);

export const apiHelpers = {
  // Articles
  articles: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      getData(client.get('/articles', { params })),
    getById: (id: string) => getData(client.get(`/articles/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/articles/slug/${slug}`)),
    create: (data: any) => getData(client.post('/articles', data)),
    update: (id: string, data: any) => getData(client.put(`/articles/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/articles/${id}`)),
  }),

  // Events
  events: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      getData(client.get('/events', { params })),
    getById: (id: string) => getData(client.get(`/events/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/events/slug/${slug}`)),
    create: (data: any) => getData(client.post('/events', data)),
    update: (id: string, data: any) => getData(client.put(`/events/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/events/${id}`)),
  }),

  // Pages
  pages: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      getData(client.get('/pages', { params })),
    getById: (id: string) => getData(client.get(`/pages/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/pages/slug/${slug}`)),
    create: (data: any) => getData(client.post('/pages', data)),
    update: (id: string, data: any) => getData(client.put(`/pages/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/pages/${id}`)),
  }),

  // Media
  media: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; type?: string; search?: string }) =>
      getData(client.get('/media', { params })),
    getById: (id: string) => getData(client.get(`/media/${id}`)),
    upload: (file: File, onProgress?: (progress: number) => void) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return client.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress?.(progress);
          }
        },
      }).then(response => response.data);
    },
    delete: (id: string) => getData(client.delete(`/media/${id}`)),
    updateMeta: (id: string, data: { alt?: string; caption?: string }) =>
      getData(client.patch(`/media/${id}`, data)),
  }),

  // Auth
  auth: (client: AxiosInstance) => ({
    login: (email: string, password: string) =>
      getData(client.post('/auth/login', { email, password })),
    register: (data: { name: string; email: string; password: string }) =>
      getData(client.post('/auth/register', data)),
    me: () => getData(client.get('/auth/me')),
    updateProfile: (data: { name?: string; email?: string }) =>
      getData(client.patch('/auth/profile', data)),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      getData(client.post('/auth/change-password', data)),
  }),

  // Stats
  stats: (client: AxiosInstance) => ({
    getDashboard: () => getData(client.get('/stats/dashboard')),
  }),
};

export type ExtendedApiClient = AxiosInstance & {
  articles: ReturnType<typeof apiHelpers.articles>;
  events: ReturnType<typeof apiHelpers.events>;
  pages: ReturnType<typeof apiHelpers.pages>;
  media: ReturnType<typeof apiHelpers.media>;
  auth: ReturnType<typeof apiHelpers.auth>;
  stats: ReturnType<typeof apiHelpers.stats>;
};

// Export default instance
let defaultClient: ExtendedApiClient | null = null;

export const initializeApi = (config: ApiClientConfig) => {
  const client = createApiClient(config);
  defaultClient = attachModules(client);
  return defaultClient;
};

export const getApi = (): ExtendedApiClient => {
  if (!defaultClient) {
    throw new Error('API Client not initialized. Call initializeApi first.');
  }
  return defaultClient;
};

const attachModules = (client: AxiosInstance): ExtendedApiClient => {
  return Object.assign(client, {
    articles: apiHelpers.articles(client),
    events: apiHelpers.events(client),
    pages: apiHelpers.pages(client),
    media: apiHelpers.media(client),
    auth: apiHelpers.auth(client),
    stats: apiHelpers.stats(client),
  });
};


export default { createApiClient, apiHelpers, initializeApi, getApi };
