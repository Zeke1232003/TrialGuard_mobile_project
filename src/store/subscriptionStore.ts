/**
 * Subscriptions store using Zustand
 * Manages subscription state and operations
 */

import { create } from 'zustand';
import { Subscription } from '@models/Subscription';

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
      // TODO: Implement Firebase Firestore fetch
      console.log('Fetching subscriptions');
      const { subscriptions: current } = get();
      // Don't overwrite with mock data: keep in-memory list so deletes and adds persist.
      // When backend exists, load from API here and set that instead.
      if (current.length === 0) {
        // Optional: seed with demo data only on first ever load (empty state)
        // set({ subscriptions: [], isLoading: false });
      }
      set({ isLoading: false });
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
      // TODO: Implement Firebase Firestore add
      console.log('Adding subscription:', subscription);
      
      const newSubscription: Subscription = {
        ...subscription,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set((state) => ({
        subscriptions: [...state.subscriptions, newSubscription],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add subscription',
        isLoading: false 
      });
    }
  },

  updateSubscription: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase Firestore update
      console.log('Updating subscription:', id, updates);
      
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === id ? { ...sub, ...updates, updatedAt: new Date() } : sub
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update subscription',
        isLoading: false 
      });
    }
  },

  deleteSubscription: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement Firebase Firestore delete
      console.log('Deleting subscription:', id);
      
      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete subscription',
        isLoading: false 
      });
    }
  },

  getSubscriptionById: (id) => {
    return get().subscriptions.find((sub) => sub.id === id);
  },

  clearError: () => set({ error: null }),
}));
