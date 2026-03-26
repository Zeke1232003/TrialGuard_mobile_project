/**
 * Subscriptions store using Zustand
 * Manages subscription state and operations
 */

import { create } from 'zustand';
import { Subscription } from '@models/Subscription';
import { apiDelete, apiGet, apiPatch, apiPost } from '@services/backendApi';
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

interface ApiSubscription {
  id: string;
  userId: string;
  name: string;
  category?: string | null;
  cost: number;
  currency: string;
  billingCycle: Subscription['billingCycle'];
  nextBillingDate: string;
  trialEndDate?: string | null;
  status: Subscription['status'];
  source: Subscription['source'];
  reminderEnabled: boolean;
  reminderDays: number;
  iconUrl?: string | null;
  iconLibrary?: Subscription['iconLibrary'] | null;
  iconName?: string | null;
  iconColor?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const mapApiToSubscription = (item: ApiSubscription): Subscription => ({
  id: item.id,
  userId: item.userId,
  name: item.name,
  category: item.category || undefined,
  cost: item.cost,
  currency: item.currency,
  billingCycle: item.billingCycle,
  nextBillingDate: new Date(item.nextBillingDate),
  trialEndDate: item.trialEndDate ? new Date(item.trialEndDate) : undefined,
  status: item.status,
  source: item.source,
  reminderEnabled: item.reminderEnabled,
  reminderDays: item.reminderDays,
  iconUrl: item.iconUrl || undefined,
  iconLibrary: item.iconLibrary || undefined,
  iconName: item.iconName || undefined,
  iconColor: item.iconColor || undefined,
  notes: item.notes || undefined,
  createdAt: new Date(item.createdAt),
  updatedAt: new Date(item.updatedAt),
});

const mapSubscriptionToPayload = (
  subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
) => ({
  name: subscription.name,
  category: subscription.category,
  cost: subscription.cost,
  currency: subscription.currency,
  billingCycle: subscription.billingCycle,
  nextBillingDate: subscription.nextBillingDate.toISOString(),
  trialEndDate: subscription.trialEndDate ? subscription.trialEndDate.toISOString() : undefined,
  status: subscription.status,
  source: subscription.source,
  reminderEnabled: subscription.reminderEnabled,
  reminderDays: subscription.reminderDays,
  iconUrl: subscription.iconUrl,
  iconLibrary: subscription.iconLibrary,
  iconName: subscription.iconName,
  iconColor: subscription.iconColor,
  notes: subscription.notes,
});

const mapUpdatesToPayload = (updates: Partial<Subscription>) => ({
  ...(updates.name !== undefined ? { name: updates.name } : {}),
  ...(updates.category !== undefined ? { category: updates.category } : {}),
  ...(updates.cost !== undefined ? { cost: updates.cost } : {}),
  ...(updates.currency !== undefined ? { currency: updates.currency } : {}),
  ...(updates.billingCycle !== undefined ? { billingCycle: updates.billingCycle } : {}),
  ...(updates.nextBillingDate !== undefined
    ? { nextBillingDate: updates.nextBillingDate.toISOString() }
    : {}),
  ...(updates.trialEndDate !== undefined
    ? { trialEndDate: updates.trialEndDate.toISOString() }
    : {}),
  ...(updates.status !== undefined ? { status: updates.status } : {}),
  ...(updates.source !== undefined ? { source: updates.source } : {}),
  ...(updates.reminderEnabled !== undefined ? { reminderEnabled: updates.reminderEnabled } : {}),
  ...(updates.reminderDays !== undefined ? { reminderDays: updates.reminderDays } : {}),
  ...(updates.iconUrl !== undefined ? { iconUrl: updates.iconUrl } : {}),
  ...(updates.iconLibrary !== undefined ? { iconLibrary: updates.iconLibrary } : {}),
  ...(updates.iconName !== undefined ? { iconName: updates.iconName } : {}),
  ...(updates.iconColor !== undefined ? { iconColor: updates.iconColor } : {}),
  ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
});

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

      const data = await apiGet<ApiSubscription[]>('/api/subscriptions');
      set({ subscriptions: data.map(mapApiToSubscription), isLoading: false });
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
      const created = await apiPost<ApiSubscription>(
        '/api/subscriptions',
        mapSubscriptionToPayload(subscription)
      );

      set((state) => ({
        subscriptions: [mapApiToSubscription(created), ...state.subscriptions],
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
      const updated = await apiPatch<ApiSubscription>(
        `/api/subscriptions/${id}`,
        mapUpdatesToPayload(updates)
      );

      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === id ? mapApiToSubscription(updated) : sub
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
      await apiDelete(`/api/subscriptions/${id}`);

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
