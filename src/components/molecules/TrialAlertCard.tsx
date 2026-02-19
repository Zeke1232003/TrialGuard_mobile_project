import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui';

interface TrialAlertCardProps {
  serviceName: string;
  daysRemaining: number;
  onView: () => void;
}

export function TrialAlertCard({ serviceName, daysRemaining, onView }: TrialAlertCardProps) {
  return (
    <View className="flex-row items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
      <View className="flex-row items-start flex-1 mr-3">
        <Ionicons name="warning" size={24} color="#EA580C" style={{ marginRight: 12 }} />
        <View className="flex-1">
          <Text className="font-medium text-orange-900">{serviceName}</Text>
          <Text className="text-sm text-orange-700">
            Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      <Button
        size="sm"
        variant="outline"
        onPress={onView}
        className="border-orange-300"
      >
        View
      </Button>
    </View>
  );
}
