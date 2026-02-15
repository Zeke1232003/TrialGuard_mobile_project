/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

/**
 * User preferences
 */
export interface UserPreferences {
  darkMode: boolean;
  remindersEnabled: boolean;
  currency: string;
  defaultReminderDays: number;
}
