/**
 * Main App Entry Point
 * Root component that initializes the application
 */

import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NewAppNavigator } from './src/components/navigation/NewAppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NewAppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}