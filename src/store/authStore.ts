/**
 * Authentication store using Zustand
 * Manages user authentication state
 */

import { create } from 'zustand';
import { User } from '@models/User';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithEmail, logoutFirebase, registerWithEmail } from '@services/firebaseClient';

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

const mapFirebaseUserToUser = (firebaseUser: import('firebase/auth').User): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
  createdAt: firebaseUser.metadata.creationTime
    ? new Date(firebaseUser.metadata.creationTime)
    : new Date(),
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const firebaseUser = await loginWithEmail(email, password);
      set({ user: mapFirebaseUserToUser(firebaseUser), isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const firebaseUser = await registerWithEmail(email, password, displayName);
      set({ user: mapFirebaseUserToUser(firebaseUser), isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutFirebase();
      set({ user: null, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
}));

onAuthStateChanged(auth, (firebaseUser) => {
  useAuthStore.setState({
    user: firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null,
    isLoading: false,
  });
});
