import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatCard } from '../components/atoms';
import { SubscriptionCard, TrialAlertCard } from '../components/molecules';
import { Button } from '../components/ui';
import { mockSubscriptions, mockUser } from '../data/mockData';

export function DashboardScreen({ navigation }: any) {
  const activeSubscriptions = useMemo(
    () => mockSubscriptions.filter((sub) => sub.status === 'active'),
    []
  );

  // Calculate days until next bill
  const subscriptionsWithDays = useMemo(() => {
    return activeSubscriptions.map((sub) => {
      const nextBillDate = new Date(sub.nextBillDate);
      const today = new Date();
      const daysUntil = Math.ceil((nextBillDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...sub, daysUntil };
    });
  }, [activeSubscriptions]);

  // Filter upcoming bills (next 30 days)
  const upcomingBills = useMemo(
    () => subscriptionsWithDays.filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= 30),
    [subscriptionsWithDays]
  );

  // Filter trials ending soon (next 7 days)
  const trialsEnding = useMemo(() => {
    return activeSubscriptions
      .filter((sub) => sub.isTrial && sub.trialEndDate)
      .map((sub) => {
        const trialEndDate = new Date(sub.trialEndDate!);
        const today = new Date();
        const daysUntil = Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { ...sub, daysUntil };
      })
      .filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= 7)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [activeSubscriptions]);

  // Calculate total monthly cost
  const totalMonthlyCost = useMemo(
    () => activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0),
    [activeSubscriptions]
  );

  const currencySymbol = mockUser.preferences.currency === 'THB' ? '฿' : '$';

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4 pb-24">
        {/* Header */}
        <View className="pt-2 mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Hello, {mockUser.fullName.split(' ')[0]}!
          </Text>
          <Text className="text-sm text-gray-600 mt-1">Track your subscriptions</Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          <StatCard
            title="Total Monthly Spend"
            value={`${currencySymbol}${totalMonthlyCost.toFixed(0)}`}
            subtitle=""
            icon={<Ionicons name="wallet" size={18} color="#6B7280" />}
            variant="gradient"
          />
          <StatCard
            title="Upcoming Bills"
            value={upcomingBills.length}
            subtitle=""
            icon={<Ionicons name="calendar" size={18} color="#6B7280" />}
          />
        </View>

        {/* Trial Alerts */}
        {trialsEnding.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="warning" size={20} color="#EA580C" style={{ marginRight: 6 }} />
              <Text className="text-lg font-semibold text-gray-900">
                Trials Ending Soon
              </Text>
            </View>
            {trialsEnding.map((sub) => (
              <View key={sub.id} className="mb-3">
                <TrialAlertCard
                  serviceName={sub.serviceName}
                  daysRemaining={sub.daysUntil}
                  onView={() => navigation.navigate('SubscriptionDetail', { id: sub.id })}
                />
              </View>
            ))}
          </View>
        )}

        {/* Active Subscriptions */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Active Subscriptions
          </Text>

          {activeSubscriptions.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons name="trending-up" size={48} color="#9CA3AF" style={{ marginBottom: 12 }} />
              <Text className="text-gray-600 mb-4">No subscriptions yet</Text>
              <Button onPress={() => navigation.navigate('AddSubscription', { initialTab: 'manual' })}>
                Add Your First
              </Button>
            </View>
          ) : (
            <View className="gap-3">
              {subscriptionsWithDays.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  {...sub}
                  onPress={() => navigation.navigate('SubscriptionDetail', { id: sub.id })}
                />
              ))}
            </View>
          )}
        </View>
        </View>
      </ScrollView>
    </View>
  );
}
