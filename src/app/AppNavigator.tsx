/**
 * Main App Navigator
 * Handles navigation between screens based on auth state
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation.types';
import { ROUTES } from './routes';
import { useAuthStore } from '@store/authStore';

// Import screens
import LoginScreen from '@features/auth/screens/LoginScreen';
import RegisterScreen from '@features/auth/screens/RegisterScreen';
import HomeScreen from '@features/dashboard/screens/HomeScreen';
import AddSubscriptionScreen from '@features/subscriptions/screens/AddSubscriptionScreen';
import SubscriptionDetailScreen from '@features/subscriptions/screens/SubscriptionDetailScreen';
import CalendarScreen from '@features/calendar/screens/CalendarScreen';
import SettingsScreen from '@features/settings/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuthStore();

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
            <Stack.Screen name={ROUTES.ADD_SUBSCRIPTION} component={AddSubscriptionScreen} />
            <Stack.Screen name={ROUTES.SUBSCRIPTION_DETAIL} component={SubscriptionDetailScreen} />
            <Stack.Screen name={ROUTES.CALENDAR} component={CalendarScreen} />
            <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
