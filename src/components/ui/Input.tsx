import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <TextInput
        className={`w-full px-4 py-3 bg-gray-50 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-xl text-base text-gray-900 ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
