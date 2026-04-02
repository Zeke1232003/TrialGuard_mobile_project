/**
 * Subscriptions store using Zustand
 * Manages subscription state and operations
 */

import { create } from 'zustand';
import { Subscription } from '@models/Subscription';
import {
  addSubscriptionToFirestore,
  deleteSubscriptionFromFirestore,
  fetchSubscriptionsFromFirestore,
  updateSubscriptionInFirestore,
} from '@services/firestoreClient';
import { auth } from '@services/authClient';

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  getSubscriptionById: (id: string) => Subscription | undefined;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!auth.currentUser) {
        set({ subscriptions: [], isLoading: false });
        return;
      }

      const data = await fetchSubscriptionsFromFirestore();
      set({ subscriptions: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
        isLoading: false,
      });
    }
  },

  addSubscription: async (subscription) => {
    set({ isLoading: true, error: null });
    try {
      const created = await addSubscriptionToFirestore(subscription);

      set((state) => ({
        subscriptions: [created, ...state.subscriptions],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add subscription';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  updateSubscription: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await updateSubscriptionInFirestore(id, updates);

      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === id ? { ...sub, ...updates, updatedAt: new Date() } : sub
        ),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update subscription';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  deleteSubscription: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteSubscriptionFromFirestore(id);

      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete subscription';
      set({ 
        error: message,
        isLoading: false 
      });
      throw new Error(message);
    }
  },

  getSubscriptionById: (id) => {
    return get().subscriptions.find((sub) => sub.id === id);
  },

  clearError: () => set({ error: null }),
}));
