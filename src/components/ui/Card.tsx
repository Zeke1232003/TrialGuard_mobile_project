import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl shadow-sm p-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
