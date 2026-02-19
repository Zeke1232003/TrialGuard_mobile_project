import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Subscription {
  id: string;
  serviceName: string;
  category: string;
  monthlyCost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillDate: string;
  isTrial: boolean;
  trialEndDate?: string;
  status: 'active' | 'cancelled' | 'expired';
  notes?: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  getTotalMonthlyCost: () => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (user) {
      // Load subscriptions for current user
      const key = `trialguard_subscriptions_${user.userId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSubscriptions(JSON.parse(saved));
      }
    } else {
      setSubscriptions([]);
    }
  }, [user]);

  const saveSubscriptions = (subs: Subscription[]) => {
    if (user) {
      const key = `trialguard_subscriptions_${user.userId}`;
      localStorage.setItem(key, JSON.stringify(subs));
      setSubscriptions(subs);
    }
  };

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: `sub_${Date.now()}`,
    };
    saveSubscriptions([...subscriptions, newSubscription]);

    // Request notification permission and schedule reminder
    if ('Notification' in window && Notification.permission === 'granted') {
      scheduleReminder(newSubscription);
    }
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    const updated = subscriptions.map((sub) =>
      sub.id === id ? { ...sub, ...updates } : sub
    );
    saveSubscriptions(updated);
  };

  const deleteSubscription = (id: string) => {
    saveSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const getSubscription = (id: string) => {
    return subscriptions.find((sub) => sub.id === id);
  };

  const getTotalMonthlyCost = () => {
    return subscriptions
      .filter((sub) => sub.status === 'active')
      .reduce((total, sub) => {
        if (sub.billingCycle === 'monthly') {
          return total + sub.monthlyCost;
        } else if (sub.billingCycle === 'yearly') {
          return total + sub.monthlyCost / 12;
        } else if (sub.billingCycle === 'weekly') {
          return total + sub.monthlyCost * 4;
        }
        return total;
      }, 0);
  };

  const scheduleReminder = (subscription: Subscription) => {
    // In a real app, this would integrate with push notifications or system notifications
    // For now, we'll just check on page load if any bills are due soon
    const daysUntilBill = Math.ceil(
      (new Date(subscription.nextBillDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilBill <= 3 && daysUntilBill >= 0) {
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('TrialGuard Reminder', {
          body: `${subscription.serviceName} will renew in ${daysUntilBill} day(s)`,
          icon: '/icon.png',
        });
      }
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscription,
        getTotalMonthlyCost,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within SubscriptionProvider');
  }
  return context;
}
