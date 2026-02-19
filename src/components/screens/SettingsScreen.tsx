import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../ui';
import { mockUser } from '../../data/mockData';

export function SettingsScreen({ navigation }: any) {
  const [currency, setCurrency] = useState(mockUser.preferences.currency);
  const [notifications, setNotifications] = useState(mockUser.preferences.notifications);
  const [darkMode, setDarkMode] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.', [
              { 
                text: 'OK', 
                onPress: () => navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                )
              }
            ]);
          },
        },
      ]
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
                {mockUser.fullName.charAt(0)}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">{mockUser.fullName}</Text>
            <Text className="text-sm text-gray-600 mt-1">{mockUser.email}</Text>
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

            {/* Notifications Toggle */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Push Notifications</Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Get notified about upcoming bills
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: '#4FD1C5', false: '#d1d5db' }}
              />
            </View>
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
