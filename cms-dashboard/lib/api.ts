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
      getData(client.get('/admin/articles', { params })),
    getById: (id: string) => getData(client.get(`/admin/articles/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/articles/slug/${slug}`)),
    create: (data: any) => getData(client.post('/admin/articles', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/articles/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/articles/${id}`)),
  }),

  // Events
  events: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      getData(client.get('/admin/events', { params })),
    getById: (id: string) => getData(client.get(`/admin/events/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/events/slug/${slug}`)),
    create: (data: any) => getData(client.post('/admin/events', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/events/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/events/${id}`)),
  }),

  // Pages
  pages: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
      getData(client.get('/admin/pages', { params })),
    getById: (id: string) => getData(client.get(`/admin/pages/${id}`)),
    getBySlug: (slug: string) => getData(client.get(`/pages/slug/${slug}`)),
    create: (data: any) => getData(client.post('/admin/pages', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/pages/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/pages/${id}`)),
  }),

  // Categories
  categories: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/categories', { params })),
    getById: (id: string) => getData(client.get(`/admin/categories/${id}`)),
    create: (data: any) => getData(client.post('/admin/categories', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/categories/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/categories/${id}`)),
  }),

  // Users
  users: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/users', { params })),
    getById: (id: string) => getData(client.get(`/admin/users/${id}`)),
    create: (data: any) => getData(client.post('/admin/users', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/users/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/users/${id}`)),
  }),

  // Media
  media: (client: AxiosInstance) => ({
    getAll: (params?: { page?: number; limit?: number; type?: string; search?: string }) =>
      getData(client.get('/admin/media', { params })),
    getById: (id: string) => getData(client.get(`/admin/media/${id}`)),
    upload: (file: File, onProgress?: (progress: number) => void) => {
      const formData = new FormData();
      formData.append('file', file);
      return client.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            onProgress?.(progress);
          }
        },
      }).then(response => response.data);
    },
    delete: (id: string) => getData(client.delete(`/admin/media/${id}`)),
    updateMeta: (id: string, data: { alt?: string; caption?: string }) =>
      getData(client.patch(`/admin/media/${id}`, data)),
  }),

  // Auth
  auth: (client: AxiosInstance) => ({
    login: (email: string, password: string) =>
      getData(client.post('/admin/login', { email, password })),
    me: () => getData(client.get('/admin/me')),
    updateProfile: (data: { name?: string; email?: string }) =>
      getData(client.patch('/admin/profile', data)),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      getData(client.post('/admin/change-password', data)),
  }),

  // Stats dashboard
  stats: (client: AxiosInstance) => ({
    getDashboard: () => getData(client.get('/admin/stats')),
  }),

  // Services (hubs métiers)
  services: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/services', { params })),
    getById: (id: string) => getData(client.get(`/admin/services/${id}`)),
    create: (data: any) => getData(client.post('/admin/services', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/services/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/services/${id}`)),
  }),

  // Références clients
  references: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/references', { params })),
    getById: (id: string) => getData(client.get(`/admin/references/${id}`)),
    create: (data: any) => getData(client.post('/admin/references', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/references/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/references/${id}`)),
  }),

  // Études de cas
  caseStudies: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/case-studies', { params })),
    getById: (id: string) => getData(client.get(`/admin/case-studies/${id}`)),
    create: (data: any) => getData(client.post('/admin/case-studies', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/case-studies/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/case-studies/${id}`)),
  }),

  // Témoignages
  testimonials: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/testimonials', { params })),
    getById: (id: string) => getData(client.get(`/admin/testimonials/${id}`)),
    create: (data: any) => getData(client.post('/admin/testimonials', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/testimonials/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/testimonials/${id}`)),
  }),

  // Équipe
  team: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/team', { params })),
    getById: (id: string) => getData(client.get(`/admin/team/${id}`)),
    create: (data: any) => getData(client.post('/admin/team', data)),
    update: (id: string, data: any) => getData(client.put(`/admin/team/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/team/${id}`)),
  }),

  // Leads / Briefs
  leads: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/leads', { params })),
    getById: (id: string) => getData(client.get(`/admin/leads/${id}`)),
    update: (id: string, data: any) => getData(client.put(`/admin/leads/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/leads/${id}`)),
  }),

  // Newsletter
  newsletter: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/newsletter', { params })),
    update: (id: string, data: any) => getData(client.put(`/admin/newsletter/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/newsletter/${id}`)),
  }),

  // Contacts
  contacts: (client: AxiosInstance) => ({
    getAll: (params?: any) => getData(client.get('/admin/contacts', { params })),
    update: (id: string, data: any) => getData(client.put(`/admin/contacts/${id}`, data)),
    delete: (id: string) => getData(client.delete(`/admin/contacts/${id}`)),
  }),

  // Paramètres
  settings: (client: AxiosInstance) => ({
    getGroup: (group: string) => getData(client.get(`/admin/settings/${group}`)),
    getAll: () => getData(client.get('/admin/settings')),
    saveGroup: (group: string, data: Record<string, any>) =>
      getData(client.put('/admin/settings', { group, data })),
    saveGeneral: (data: Record<string, any>) =>
      getData(client.post('/admin/settings/general', data)),
  }),
};

export type ExtendedApiClient = AxiosInstance & {
  articles:    ReturnType<typeof apiHelpers.articles>;
  events:      ReturnType<typeof apiHelpers.events>;
  pages:       ReturnType<typeof apiHelpers.pages>;
  media:       ReturnType<typeof apiHelpers.media>;
  auth:        ReturnType<typeof apiHelpers.auth>;
  stats:       ReturnType<typeof apiHelpers.stats>;
  services:    ReturnType<typeof apiHelpers.services>;
  references:  ReturnType<typeof apiHelpers.references>;
  caseStudies: ReturnType<typeof apiHelpers.caseStudies>;
  testimonials:ReturnType<typeof apiHelpers.testimonials>;
  team:        ReturnType<typeof apiHelpers.team>;
  leads:       ReturnType<typeof apiHelpers.leads>;
  newsletter:  ReturnType<typeof apiHelpers.newsletter>;
  contacts:    ReturnType<typeof apiHelpers.contacts>;
  settings:    ReturnType<typeof apiHelpers.settings>;
};

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
    articles:    apiHelpers.articles(client),
    events:      apiHelpers.events(client),
    pages:       apiHelpers.pages(client),
    media:       apiHelpers.media(client),
    auth:        apiHelpers.auth(client),
    stats:       apiHelpers.stats(client),
    services:    apiHelpers.services(client),
    references:  apiHelpers.references(client),
    caseStudies: apiHelpers.caseStudies(client),
    testimonials:apiHelpers.testimonials(client),
    team:        apiHelpers.team(client),
    leads:       apiHelpers.leads(client),
    newsletter:  apiHelpers.newsletter(client),
    contacts:    apiHelpers.contacts(client),
    settings:    apiHelpers.settings(client),
  });
};

export default { createApiClient, apiHelpers, initializeApi, getApi };
