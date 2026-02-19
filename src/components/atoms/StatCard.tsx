import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../ui';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
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
