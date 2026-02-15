/**
 * Subscription Detail Screen
 * Shows detailed view of a specific subscription with edit/delete options
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionDetailScreenProps } from '@/app/navigation.types';
import { useSubscriptionStore } from '@store/subscriptionStore';
import { formatCurrency, daysUntil, formatDate } from '@core/utils';
import { ROUTES } from '@/app/routes';

const SubscriptionDetailScreen: React.FC<SubscriptionDetailScreenProps> = ({ navigation, route }) => {
  const { subscriptionId } = route.params;
  const { getSubscriptionById, updateSubscription, deleteSubscription } = useSubscriptionStore();
  const [subscription, setSubscription] = useState(getSubscriptionById(subscriptionId));
  const [reminderEnabled, setReminderEnabled] = useState(subscription?.reminderEnabled || false);

  useEffect(() => {
    const sub = getSubscriptionById(subscriptionId);
    setSubscription(sub);
    setReminderEnabled(sub?.reminderEnabled || false);
  }, [subscriptionId, getSubscriptionById]);

  if (!subscription) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-lg text-danger text-center mt-12">Subscription not found</Text>
      </SafeAreaView>
    );
  }

  const endDate = subscription.trialEndDate ?? subscription.nextBillingDate;
  const daysRemaining = daysUntil(endDate);
  const isTrialEnding = subscription.status === 'trial' && daysRemaining <= 2;

  const handleReminderToggle = async () => {
    const newValue = !reminderEnabled;
    setReminderEnabled(newValue);
    await updateSubscription(subscription.id, { reminderEnabled: newValue });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete ${subscription.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteSubscription(subscription.id);
          navigation.goBack();
        }},
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="pt-4 px-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-primary font-medium">← Back</Text>
          </TouchableOpacity>
        </View>

        {isTrialEnding && (
          <View className="bg-warning py-2 items-center mx-6 rounded-lg my-4">
            <Text className="text-sm font-semibold text-white">TRIAL ENDS IN {daysRemaining} DAYS</Text>
          </View>
        )}

        <View className="items-center py-8">
          <View className="w-20 h-20 bg-gray-100 rounded-2xl justify-center items-center mb-4">
            <Text className="text-4xl">
              {subscription.name === 'Netflix' ? '📺' : subscription.name === 'Spotify' ? '🎵' : '📱'}
            </Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-1">{subscription.name}</Text>
          <Text className="text-lg text-gray-500">
            {formatCurrency(subscription.cost)} / {subscription.billingCycle}
          </Text>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Detail Grid</Text>
          <View className="py-4 border-b border-gray-100">
            <Text className="text-sm font-medium text-gray-900 mb-1">Billing Cycle</Text>
            <Text className="text-sm text-gray-500">
              {subscription.billingCycle} (Next: {formatDate(subscription.nextBillingDate)})
            </Text>
          </View>
          {subscription.trialEndDate && (
            <View className="py-4 border-b border-gray-100">
              <Text className="text-sm font-medium text-gray-900 mb-1">End date</Text>
              <Text className="text-sm text-gray-500">{formatDate(subscription.trialEndDate)}</Text>
            </View>
          )}
          <View className="py-4 border-b border-gray-100">
            <Text className="text-sm font-medium text-gray-900 mb-1">Source</Text>
            <Text className="text-sm text-gray-500">Added from {subscription.source} parsing</Text>
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-base text-gray-900">Remind me {subscription.reminderDays} days before</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: '#D1D5DB', true: '#36D9B8' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View className="flex-row px-6 mb-8">
          <TouchableOpacity className="flex-1 bg-danger rounded-xl py-4 items-center mr-2" onPress={handleDelete}>
            <Text className="text-base font-semibold text-white">Delete Subscription</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-info rounded-xl py-4 items-center ml-2">
            <Text className="text-base font-semibold text-white">Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="flex-row justify-evenly items-center py-4 pb-6 border-t border-gray-200 bg-white">
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
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Text className="text-2xl mb-1">⚙️</Text>
          <Text className="text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionDetailScreen;
