/**
 * Subscription model
 */

export type BillingCycle = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'trial' | 'cancelled' | 'expired';

export type SubscriptionSource = 'manual' | 'email' | 'sms';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
  trialEndDate?: Date;
  status: SubscriptionStatus;
  source: SubscriptionSource;
  reminderEnabled: boolean;
  reminderDays: number;
  iconUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parsed data from email/SMS receipt
 */
export interface ParsedSubscriptionData {
  name?: string;
  cost?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  nextBillingDate?: Date;
  trialEndDate?: Date;
}
