import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../ui';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  variant?: 'gradient' | 'default';
}

export function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
  if (variant === 'gradient') {
    // Gradient style like in the image
    return (
      <View className="flex-1 rounded-2xl p-5 shadow-md" style={{ backgroundColor: '#6EE7DC' }}>
        <Text className="text-sm text-gray-700 font-medium mb-2">{title}</Text>
        <Text className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </Text>
      </View>
    );
  }

  return (
    <Card className="flex-1">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-gray-600">{title}</Text>
        <View className="w-4 h-4">{icon}</View>
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">
        {value}
      </Text>
      <Text className="text-xs text-gray-500">{subtitle}</Text>
    </Card>
  );
}
