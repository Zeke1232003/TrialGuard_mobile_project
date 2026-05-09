import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReminderSettingsState {
  dailySummaryEnabled: boolean;
  alarmModeEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  setDailySummaryEnabled: (enabled: boolean) => void;
  setAlarmModeEnabled: (enabled: boolean) => void;
  setReminderTime: (hour: number, minute: number) => void;
}

function normalizeHour(value: number): number {
  if (Number.isNaN(value)) return 9;
  return Math.min(23, Math.max(0, Math.trunc(value)));
}

function normalizeMinute(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(59, Math.max(0, Math.trunc(value)));
}

export const useReminderSettingsStore = create<ReminderSettingsState>()(
  persist(
    (set) => ({
      dailySummaryEnabled: true,
      alarmModeEnabled: false,
      reminderHour: 9,
      reminderMinute: 0,
      setDailySummaryEnabled: (enabled) => set({ dailySummaryEnabled: enabled }),
      setAlarmModeEnabled: (enabled) => set({ alarmModeEnabled: enabled }),
      setReminderTime: (hour, minute) =>
        set({
          reminderHour: normalizeHour(hour),
          reminderMinute: normalizeMinute(minute),
        }),
    }),
    {
      name: 'trialguard-reminder-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dailySummaryEnabled: state.dailySummaryEnabled,
        alarmModeEnabled: state.alarmModeEnabled,
        reminderHour: state.reminderHour,
        reminderMinute: state.reminderMinute,
      }),
    }
  )
);
