import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useReminderSettingsStore } from '../store/reminderSettingsStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { scheduleTestNotificationAsync } from '../services/notificationService';
import { deleteAllCurrentUserDataFromFirestore } from '../services/firestoreClient';
import { deleteCurrentUserAuth } from '../services/authClient';

const reminderTimeOptions = [
  { label: '08:00 AM', hour: 8, minute: 0 },
  { label: '09:00 AM', hour: 9, minute: 0 },
  { label: '06:00 PM', hour: 18, minute: 0 },
  { label: '08:00 PM', hour: 20, minute: 0 },
];

function formatReminderTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minuteText = String(minute).padStart(2, '0');
  return `${String(hour12).padStart(2, '0')}:${minuteText} ${period}`;
}

export function SettingsScreen({ navigation }: any) {
  const isWebRuntime = Platform.OS === 'web';
  const { user, logout } = useAuthStore();
  const { subscriptions, syncSummaryNotification } = useSubscriptionStore();
  const {
    dailySummaryEnabled,
    alarmModeEnabled,
    reminderHour,
    reminderMinute,
    setDailySummaryEnabled,
    setAlarmModeEnabled,
    setReminderTime,
  } = useReminderSettingsStore();
  const [currency, setCurrency] = useState<'THB' | 'USD'>('THB');
  const [darkMode, setDarkMode] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);

  const displayName = user?.displayName || 'User';
  const email = user?.email || 'No email';

  const navigateToLogin = () => {
    const rootNavigation = navigation?.getParent?.()?.getParent?.() ?? navigation?.getParent?.() ?? navigation;
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'AuthStack', params: { screen: 'Login' } }],
    });
  };

  const doLogout = async () => {
    try {
      await logout();
      navigateToLogin();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Logout failed');
    }
  };

  const doDeleteAccount = async () => {
    try {
      await deleteAllCurrentUserDataFromFirestore();
      await deleteCurrentUserAuth();

      navigateToLogin();

      if (Platform.OS === 'web') {
        globalThis.alert('Account deleted permanently.');
        return;
      }

      Alert.alert('Account Deleted', 'Your account and data were deleted permanently.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account';
      const lower = message.toLowerCase();

      if (lower.includes('requires-recent-login') || lower.includes('auth/requires-recent-login')) {
        Alert.alert(
          'Re-login Required',
          'For security, please log out, log in again, and then try deleting your account.'
        );
        return;
      }

      Alert.alert('Delete Account Failed', message);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = globalThis.confirm('Are you sure you want to logout?');
      if (confirmed) {
        void doLogout();
      }
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            void doLogout();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const confirmed = globalThis.confirm(
        'This will permanently delete your account and all data. This action cannot be undone.'
      );
      if (confirmed) {
        void doDeleteAccount();
      }
      return;
    }

    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void doDeleteAccount();
          },
        },
      ]
    );
  };

  const handleToggleDailySummary = (enabled: boolean) => {
    setDailySummaryEnabled(enabled);
    syncSummaryNotification(subscriptions);
  };

  const handleSelectReminderTime = (hour: number, minute: number) => {
    setReminderTime(hour, minute);
    setShowReminderTimePicker(false);
    syncSummaryNotification(subscriptions);
  };

  const handleToggleAlarmMode = (enabled: boolean) => {
    setAlarmModeEnabled(enabled);
    syncSummaryNotification(subscriptions);
  };

  const handleSendTestNotification = async () => {
    if (isWebRuntime) {
      globalThis.alert(
        'Test alarms are not available on web. Please use the Android or iOS app runtime to test local notifications.'
      );
      return;
    }

    const result = await scheduleTestNotificationAsync(10, alarmModeEnabled);

    if (result !== 'scheduled') {
      if (result === 'unsupported_expo_go_android') {
        Alert.alert(
          'Not Supported In Expo Go',
          'Android Expo Go does not support this notification feature. Use a development build (EAS dev client) to test alarms.'
        );
        return;
      }

      if (result === 'unsupported_web') {
        Alert.alert(
          'Not Supported On Web',
          'Local phone notifications cannot run on Firebase hosting/web. Use Android or iOS native app runtime.'
        );
        return;
      }

      if (result === 'module_unavailable') {
        Alert.alert(
          'Notification Module Unavailable',
          'The notifications module is unavailable in this runtime. Restart app and test with a native development build.'
        );
        return;
      }

      Alert.alert(
        'Test Notification Failed',
        'Enable app notifications in phone settings and try again.'
      );
      return;
    }

    Alert.alert(
      'Test Scheduled',
      'A test notification will appear in about 10 seconds. Lock your screen to verify it.'
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pb-24">
        {/* Profile Section */}
        <Card className="mb-6">
          <View className="items-center py-4">
            <View className="w-20 h-20 bg-[#4FD1C5] rounded-full items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">
                {displayName.charAt(0)}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">{displayName}</Text>
            <Text className="text-sm text-gray-600 mt-1">{email}</Text>
          </View>
        </Card>

        {/* Preferences */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Preferences</Text>

          <Card>
            {/* Currency Dropdown */}
            <TouchableOpacity 
              onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
              className="py-3 border-b border-gray-100"
            >
              <Text className="text-sm text-gray-600 mb-2">Currency</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-900 font-medium">
                  {currency === 'THB' ? 'Thai Baht (฿)' : 'US Dollar ($)'}
                </Text>
                <Text className="text-gray-400">{showCurrencyPicker ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {/* Currency Options (dropdown) */}
            {showCurrencyPicker && (
              <View className="border-b border-gray-100">
                <TouchableOpacity
                  onPress={() => {
                    setCurrency('THB');
                    setShowCurrencyPicker(false);
                  }}
                  className={`py-3 px-4 ${currency === 'THB' ? 'bg-teal-50' : ''}`}
                >
                  <Text className={`${currency === 'THB' ? 'text-[#4FD1C5] font-semibold' : 'text-gray-700'}`}>
                    Thai Baht (฿)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCurrency('USD');
                    setShowCurrencyPicker(false);
                  }}
                  className={`py-3 px-4 ${currency === 'USD' ? 'bg-teal-50' : ''}`}
                >
                  <Text className={`${currency === 'USD' ? 'text-[#4FD1C5] font-semibold' : 'text-gray-700'}`}>
                    US Dollar ($)
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Dark Mode Toggle */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Dark Mode</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ true: '#4FD1C5', false: '#d1d5db' }}
              />
            </View>

            {/* Daily Summary Toggle */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Daily Summary Notifications</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  One notification each day about subscriptions expiring soon
                </Text>
              </View>
              <Switch
                value={dailySummaryEnabled}
                onValueChange={handleToggleDailySummary}
                trackColor={{ true: '#4FD1C5', false: '#d1d5db' }}
              />
            </View>

            {/* Alarm Mode Toggle */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Alarm Mode</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  ON uses alarm-style alerts. OFF uses normal notifications.
                </Text>
              </View>
              <Switch
                value={alarmModeEnabled}
                onValueChange={handleToggleAlarmMode}
                trackColor={{ true: '#4FD1C5', false: '#d1d5db' }}
              />
            </View>

            {/* Reminder Time */}
            <TouchableOpacity
              onPress={() => setShowReminderTimePicker(!showReminderTimePicker)}
              className="py-3"
            >
              <Text className="text-sm text-gray-600 mb-2">Daily Reminder Time</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-gray-900 font-medium">
                  {formatReminderTime(reminderHour, reminderMinute)}
                </Text>
                <Text className="text-gray-400">{showReminderTimePicker ? '▲' : '▼'}</Text>
              </View>
            </TouchableOpacity>

            {showReminderTimePicker && (
              <View>
                {reminderTimeOptions.map((option) => {
                  const selected = option.hour === reminderHour && option.minute === reminderMinute;
                  return (
                    <TouchableOpacity
                      key={option.label}
                      onPress={() => handleSelectReminderTime(option.hour, option.minute)}
                      className={`py-3 px-4 ${selected ? 'bg-teal-50' : ''}`}
                    >
                      <Text className={`${selected ? 'text-[#4FD1C5] font-semibold' : 'text-gray-700'}`}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </Card>
        </View>

        {/* App Info */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">About</Text>

          <Card>
            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-900">App Version</Text>
              <Text className="text-gray-600">1.0.0</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <Text className="text-gray-900">Privacy Policy</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <Text className="text-gray-900">Terms of Service</Text>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Actions */}
        <View className="gap-3">
          {isWebRuntime && (
            <Text className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Test alarms are available only in Android/iOS app runtime.
            </Text>
          )}

          <Button variant="outline" onPress={handleSendTestNotification} disabled={isWebRuntime}>
            {isWebRuntime
              ? 'Test Alarm Unavailable On Web'
              : (alarmModeEnabled ? 'Send Test Alarm (10s)' : 'Send Test Notification (10s)')}
          </Button>

          <Button variant="secondary" onPress={handleLogout}>
            Logout
          </Button>

          <Button variant="outline" onPress={handleDeleteAccount} className="border-red-500">
            <Text className="text-red-500 font-medium">Delete Account</Text>
          </Button>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500">Made with </Text>
            <Ionicons name="heart" size={14} color="#EF4444" />
            <Text className="text-sm text-gray-500"> for Students</Text>
          </View>
          <Text className="text-xs text-gray-400 mt-1">© 2026 TrialGuard</Text>
        </View>
      </View>
    </ScrollView>
  );
}
