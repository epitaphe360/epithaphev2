// Simple API helper sans besoin d'initialisation
// Ajoute automatiquement le préfixe /api aux URLs
import { useAuthStore } from '../store/authStore';

const prefixUrl = (url: string) => {
  // Si l'URL commence déjà par /api, ne pas ajouter le préfixe
  if (url.startsWith('/api/')) return url;
  // Ajouter /api au début
  return `/api${url}`;
};

// Helper to get auth headers
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  async get(url: string) {
    const response = await fetch(prefixUrl(url), {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async post(url: string, data: any) {
    const response = await fetch(prefixUrl(url), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async put(url: string, data: any) {
    const response = await fetch(prefixUrl(url), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },

  async delete(url: string) {
    const response = await fetch(prefixUrl(url), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.ok;
  },
};

// Hook pour utiliser l'API
export const useApi = () => api;

// Fonction pour obtenir l'API (compatibilité)
export const getApi = () => api;
