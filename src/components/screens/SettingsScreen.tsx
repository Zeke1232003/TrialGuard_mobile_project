import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from '../ui';
import { mockUser } from '../../data/mockData';

export function SettingsScreen({ navigation }: any) {
  const [currency, setCurrency] = useState(mockUser.preferences.currency);
  const [notifications, setNotifications] = useState(mockUser.preferences.notifications);

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
            navigation.replace('Login');
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
              { text: 'OK', onPress: () => navigation.replace('Login') }
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
            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-600 mb-2">Currency</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setCurrency('THB')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 ${
                    currency === 'THB'
                      ? 'border-[#4FD1C5] bg-teal-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      currency === 'THB' ? 'text-[#4FD1C5]' : 'text-gray-700'
                    }`}
                  >
                    THB (฿)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCurrency('USD')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 ${
                    currency === 'USD'
                      ? 'border-[#4FD1C5] bg-teal-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      currency === 'USD' ? 'text-[#4FD1C5]' : 'text-gray-700'
                    }`}
                  >
                    USD ($)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
          <Text className="text-sm text-gray-500">Made with ❤️ for Students</Text>
          <Text className="text-xs text-gray-400 mt-1">© 2026 TrialGuard</Text>
        </View>
      </View>
    </ScrollView>
  );
}
