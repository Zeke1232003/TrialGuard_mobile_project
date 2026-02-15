/**
 * Route names as constants
 * Prevents typos and makes refactoring easier
 */

export const ROUTES = {
  // Auth routes
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main app routes
  HOME: 'Home',
  ADD_SUBSCRIPTION: 'AddSubscription',
  SUBSCRIPTION_DETAIL: 'SubscriptionDetail',
  CALENDAR: 'Calendar',
  SETTINGS: 'Settings',
} as const;

export type RouteNames = typeof ROUTES[keyof typeof ROUTES];
