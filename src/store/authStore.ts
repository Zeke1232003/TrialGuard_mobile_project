/**
 * Authentication store using Zustand
 * Manages user authentication state
 */

import { create } from 'zustand';
import { User } from '@models/User';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase authentication
      // For now, mock user login
      console.log('Login attempt:', email);
      
      // Mock user for Week 4
      const mockUser: User = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
      };
      
      set({ user: mockUser, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false 
      });
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase authentication
      console.log('Register attempt:', email, displayName);
      
      // Mock user for Week 4
      const mockUser: User = {
        id: '1',
        email,
        displayName,
        createdAt: new Date(),
      };
      
      set({ user: mockUser, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false 
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase logout
      console.log('Logout');
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
