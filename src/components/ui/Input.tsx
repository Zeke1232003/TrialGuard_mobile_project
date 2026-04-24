import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  enablePasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  className = '',
  enablePasswordToggle = false,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldShowPasswordToggle = enablePasswordToggle;
  const resolvedSecureTextEntry = useMemo(() => {
    if (!shouldShowPasswordToggle) {
      return secureTextEntry;
    }
    return !isPasswordVisible;
  }, [isPasswordVisible, secureTextEntry, shouldShowPasswordToggle]);

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          className={`w-full px-4 py-3 bg-gray-50 border ${
            error ? 'border-red-500' : 'border-gray-200'
          } rounded-xl text-base text-gray-900 ${shouldShowPasswordToggle ? 'pr-12' : ''} ${className}`}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={resolvedSecureTextEntry}
          {...props}
        />

        {shouldShowPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-3 top-1/2"
            style={{ transform: [{ translateY: -12 }] }}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}
