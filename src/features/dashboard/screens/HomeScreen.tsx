/**
 * Home Screen (Dashboard)
 * Main dashboard showing subscription overview and upcoming bills
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenProps } from '@/app/navigation.types';
import { ROUTES } from '@/app/routes';
import { useAuthStore, useSubscriptionStore } from '@store/index';
import { formatCurrency, daysUntil } from '@core/utils';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.billingCycle === 'monthly')
    .reduce((sum, sub) => sum + sub.cost, 0);

  const getRelevantDate = (sub: { nextBillingDate: Date; trialEndDate?: Date }) =>
    sub.trialEndDate ?? sub.nextBillingDate;

  const upcomingBills = subscriptions
    .filter(sub => daysUntil(getRelevantDate(sub)) <= 7)
    .sort((a, b) => getRelevantDate(a).getTime() - getRelevantDate(b).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center px-6 pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-900">Hello, {user?.displayName}</Text>
        </View>

        <View className="bg-primary-light mx-6 p-6 rounded-2xl mb-8">
          <Text className="text-sm text-gray-500 mb-1">Total Monthly Spend</Text>
          <Text className="text-4xl font-bold text-gray-900">{formatCurrency(totalMonthlySpend)}</Text>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {upcomingBills.map((subscription) => (
              <View key={subscription.id} className="items-center mr-4 w-20">
                <View className="w-12 h-12 bg-gray-100 rounded-xl justify-center items-center mb-1">
                  <Text className="text-2xl">📺</Text>
                </View>
                <Text className="text-xs font-medium text-center mb-1">{subscription.name}</Text>
                <Text className="text-xs text-gray-500">{daysUntil(getRelevantDate(subscription))}d</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Subscriptions</Text>
          {subscriptions.map((subscription) => (
            <TouchableOpacity
              key={subscription.id}
              className="flex-row justify-between items-center py-4 border-b border-gray-100"
              onPress={() =>
                navigation.navigate(ROUTES.SUBSCRIPTION_DETAIL, { subscriptionId: subscription.id })
              }
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-xl justify-center items-center mr-4">
                  <Text className="text-2xl">
                    {subscription.name === 'Netflix' ? '📺' : subscription.name === 'Spotify' ? '🎵' : '📱'}
                  </Text>
                </View>
                <View>
                  <Text className="text-base font-medium text-gray-900">{subscription.name}</Text>
                  <Text className="text-sm text-gray-500">
                    {subscription.status === 'trial' ? 'Trial' : subscription.billingCycle}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-base font-semibold text-gray-900">{formatCurrency(subscription.cost)}</Text>
                <Text className="text-xs text-gray-500">
                  {subscription.trialEndDate
                    ? `Ends: ${daysUntil(subscription.trialEndDate)}d`
                    : `Next Bill: ${daysUntil(subscription.nextBillingDate)}d`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row justify-around items-center py-4 pb-6 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center flex-1">
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
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Text className="text-2xl mb-1">⚙️</Text>
          <Text className="text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
