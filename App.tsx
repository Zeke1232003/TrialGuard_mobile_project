/**
 * Main App Entry Point
 * Root component that initializes the application
 */

import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@/app/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}