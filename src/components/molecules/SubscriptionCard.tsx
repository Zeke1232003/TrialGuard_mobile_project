import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Badge } from '../ui';

interface SubscriptionCardProps {
  id: string;
  serviceName: string;
  category: string;
  monthlyCost: number;
  currency: string;
  nextBillDate: string;
  billingCycle: string;
  isTrial: boolean;
  daysUntil: number;
  onPress: () => void;
}

export function SubscriptionCard({
  serviceName,
  category,
  monthlyCost,
  currency,
  nextBillDate,
  billingCycle,
  isTrial,
  daysUntil,
  onPress,
}: SubscriptionCardProps) {
  const currencySymbol = currency === 'THB' ? '฿' : '$';
  
  // Format date
  const date = new Date(nextBillDate);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl shadow-sm p-4 flex-row items-center justify-between active:opacity-70"
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-base font-semibold text-gray-900 mr-2">
            {serviceName}
          </Text>
          {isTrial && <Badge variant="success">Trial</Badge>}
        </View>
        <Text className="text-sm text-gray-600 mb-1">{category}</Text>
        <Text className="text-xs text-gray-500">
          Next bill: {formattedDate} • {daysUntil} days
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-gray-900">
          {currencySymbol}{monthlyCost}
        </Text>
        <Text className="text-xs text-gray-500 capitalize">{billingCycle}</Text>
      </View>
    </TouchableOpacity>
  );
}
