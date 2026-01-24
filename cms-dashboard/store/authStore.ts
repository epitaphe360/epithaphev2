// ========================================
// CMS Dashboard - Auth Store
// ========================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  
  // Helpers
  hasRole: (role: User['role'] | User['role'][]) => boolean;
  getAuthHeader: () => { Authorization: string } | {};
}

export const createAuthStore = (storageKey = 'cms-auth-storage') => {
  return create<AuthState>()(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: (token, user) => {
          set({ 
            token, 
            user, 
            isAuthenticated: true,
            isLoading: false 
          });
        },

        logout: () => {
          set({ 
            token: null, 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        },

        updateUser: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...userData } });
          }
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        hasRole: (role) => {
          const user = get().user;
          if (!user) return false;
          
          if (Array.isArray(role)) {
            return role.includes(user.role);
          }
          return user.role === role;
        },

        getAuthHeader: () => {
          const token = get().token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  );
};

// Instance par défaut
export const useAuthStore = createAuthStore();

// Export pour créer des stores personnalisés
export type { AuthState };
