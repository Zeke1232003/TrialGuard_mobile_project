/**
 * Settings Screen
 * User profile, preferences, and account management
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsScreenProps } from '@/app/navigation.types';
import { useAuthStore } from '@store/authStore';
import { ROUTES } from '@/app/routes';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-row justify-between items-center px-6 py-6">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#36D9B8' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Profile</Text>
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-gray-300 rounded-full justify-center items-center mr-4">
              <Text className="text-lg font-bold text-gray-900">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900">Hello, {user?.displayName}</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Account</Text>
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 justify-center items-center mr-4">
              <Text className="text-xl">📧</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900 mb-0.5">Email: {user?.email}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 justify-center items-center mr-4">
              <Text className="text-xl">☁️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900">Linked Accounts (Google)</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Preferences</Text>
          <View className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 justify-center items-center mr-4">
              <Text className="text-xl">🎵</Text>
            </View>
            <View className="flex-1">
              <View className="mb-2">
                <Text className="text-base text-gray-900">Dark Mode</Text>
                <Text className="text-sm text-gray-500">Reminders Enabled</Text>
              </View>
              <View>
                <Text className="text-base text-gray-900">Dark Mode</Text>
                <Text className="text-sm text-gray-500">Currency: THB (฿)</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Support</Text>
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <Text className="text-base text-gray-900 flex-1">Help & FAQ</Text>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500 mr-2">Should</Text>
              <Switch
                value={true}
                trackColor={{ false: '#D1D5DB', true: '#36D9B8' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-10 justify-center items-center mr-4">
              <Text className="text-xl">💎</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900">Contact Us</Text>
            </View>
            <Text className="text-sm text-gray-500">Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 mb-8">
          <TouchableOpacity className="bg-danger rounded-xl py-4 items-center" onPress={handleLogout}>
            <Text className="text-base font-semibold text-white">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="flex-row justify-around items-center py-4 pb-6 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Text className="text-2xl mb-1">🏠</Text>
          <Text className="text-xs text-gray-500">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.ADD_SUBSCRIPTION)}>
          <Text className="text-2xl mb-1">➕</Text>
          <Text className="text-xs text-gray-500">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
          <Text className="text-2xl mb-1">📅</Text>
          <Text className="text-xs text-gray-500">Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1">
          <Text className="text-2xl mb-1">⚙️</Text>
          <Text className="text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
