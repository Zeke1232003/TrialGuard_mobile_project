function mapAuthError(error: any): string {
  if (!error || typeof error !== 'object') return 'An unknown error occurred.';
  const code = error.code || error.message || '';
  if (
    code.includes('auth/invalid-credential') ||
    code.includes('auth/invalid-email') ||
    code.includes('auth/user-not-found') ||
    code.includes('auth/wrong-password') ||
    code.includes('INVALID_LOGIN_CREDENTIALS')
  ) {
    return 'Check your email and password';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  return 'Login failed. Please try again.';
}
/**
 * Authentication store using Zustand
 * Manages user authentication state
 */

import { create } from 'zustand';
import { User } from '@models/User';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithEmail, logoutAuth, registerWithEmail } from '@services/authClient';

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

const mapAuthUserToUser = (authUser: import('firebase/auth').User): User => ({
  id: authUser.uid,
  email: authUser.email || '',
  displayName: authUser.displayName || (authUser.email ? authUser.email.split('@')[0] : 'User'),
  createdAt: authUser.metadata.creationTime
    ? new Date(authUser.metadata.creationTime)
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
      const authUser = await loginWithEmail(email, password);
      set({ user: mapAuthUserToUser(authUser), isLoading: false });
    } catch (error) {
      const message = mapAuthError(error);
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
      const authUser = await registerWithEmail(email, password, displayName);
      set({ user: mapAuthUserToUser(authUser), isLoading: false });
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
      await logoutAuth();
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
    user: firebaseUser ? mapAuthUserToUser(firebaseUser) : null,
    isLoading: false,
  });
});
