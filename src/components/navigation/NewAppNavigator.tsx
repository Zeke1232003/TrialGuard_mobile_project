import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import {
  LoginScreen,
  RegisterScreen,
  DashboardScreen,
  AddSubscriptionScreen,
  SubscriptionDetailScreen,
  CalendarScreen,
  SettingsScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

// Simple bottom tab bar component with floating add button
function BottomTabBar({ navigation }: any) {
  const getFocusedRouteName = () => {
    const state = navigation.getState?.();
    if (!state?.routes?.length) {
      return 'Dashboard';
    }

    const mainRoute = state.routes.find((route: any) => route.name === 'Main') || state.routes[state.index ?? 0];
    let currentRoute = mainRoute;

    while (currentRoute?.state?.routes?.length) {
      currentRoute = currentRoute.state.routes[currentRoute.state.index ?? 0];
    }

    return currentRoute?.name || 'Dashboard';
  };

  const activeRoute = getFocusedRouteName();
  const hiddenRoutes = ['AddSubscription', 'SubscriptionDetail'];

  if (hiddenRoutes.includes(activeRoute)) {
    return null;
  }
  
  const tabs = [
    { name: 'Dashboard', icon: 'home', route: 'Dashboard' },
    { name: 'Calendar', icon: 'calendar', route: 'Calendar' },
    { name: 'Settings', icon: 'settings', route: 'Settings' },
  ];

  const handleTabPress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <>
      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddSubscription')}
        className="absolute bottom-20 right-6 w-14 h-14 bg-[#4FD1C5] rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 8 }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row shadow-lg">
        {tabs.map((tab) => {
          const isFocused = activeRoute === tab.route;
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handleTabPress(tab.route)}
              className="flex-1 items-center py-3"
            >
              <Ionicons 
                name={tab.icon as any} 
                size={24} 
                color={isFocused ? '#4FD1C5' : '#9CA3AF'} 
              />
              <Text className={`text-xs mt-1 ${isFocused ? 'text-[#4FD1C5] font-semibold' : 'text-gray-600'}`}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#111827',
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddSubscription" 
        component={AddSubscriptionScreen}
        options={{ title: 'Add Subscription' }}
      />
      <Stack.Screen 
        name="SubscriptionDetail" 
        component={SubscriptionDetailScreen}
        options={{ title: 'Subscription Details' }}
      />
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function NewAppNavigator() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4FD1C5" />
        <Text className="mt-3 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="Main">
            {(props) => (
              <View className="flex-1">
                <MainNavigator />
                <BottomTabBar {...props} />
              </View>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
