/**
 * Application-wide constants
 */

export const APP_NAME = 'TrialGuard';

export const CURRENCY = {
  THB: '฿',
  USD: '$',
  EUR: '€',
};

export const BILLING_CYCLE = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export const REMINDER_DAYS = [1, 2, 3, 5, 7];

export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
