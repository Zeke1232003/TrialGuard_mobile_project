import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'items-center justify-center rounded-xl';
  
  const variantClasses = {
    primary: 'bg-[#4FD1C5]',
    secondary: 'bg-gray-200',
    outline: 'border-2 border-[#4FD1C5] bg-transparent',
    ghost: 'bg-transparent',
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-3 px-6',
    lg: 'py-4 px-8',
  };

  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-900',
    outline: 'text-[#4FD1C5]',
    ghost: 'text-gray-900',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const disabledClasses = disabled || loading ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#4FD1C5'} />
      ) : (
        <Text className={`font-medium ${textColorClasses[variant]} ${textSizeClasses[size]}`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
