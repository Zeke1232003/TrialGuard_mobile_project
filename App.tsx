/**
 * Main App Entry Point
 * Root component that initializes the application
 */

import './global.css';
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import {
  initializeNotificationsAsync,
  registerAlarmCloseActionHandlerAsync,
} from './src/services/notificationService';
import { RootStackParamList } from './src/navigation/NewAppNavigator';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initializeNotificationsAsync().catch((error) => {
      console.warn('Failed to initialize notifications', error);
    });

    registerAlarmCloseActionHandlerAsync(() => {
      navigationRef.current?.navigate('AuthStack', { screen: 'Login' });
    })
      .then((removeListener) => {
        cleanup = removeListener;
      })
      .catch((error) => {
        console.warn('Failed to register alarm action handler', error);
      });

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}