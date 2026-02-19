import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-teal-100 text-teal-700',
    warning: 'bg-orange-100 text-orange-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <View className={`px-2 py-1 rounded-full ${variantClasses[variant]} ${className}`}>
      <Text className={`text-xs font-medium ${variantClasses[variant]}`}>
        {children}
      </Text>
    </View>
  );
}
