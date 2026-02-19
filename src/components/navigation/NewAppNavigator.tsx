import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text } from 'react-native';
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

// Simple bottom tab bar component
function BottomTabBar({ navigation, state }: any) {
  const tabs = [
    { name: 'Dashboard', icon: '🏠', route: 'Dashboard' },
    { name: 'Add', icon: '➕', route: 'AddSubscription' },
    { name: 'Calendar', icon: '📅', route: 'Calendar' },
    { name: 'Settings', icon: '⚙️', route: 'Settings' },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row">
      {tabs.map((tab, index) => {
        const isFocused = state.routes[state.index].name === tab.route;
        
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.route)}
            className="flex-1 items-center py-3"
          >
            <Text className="text-2xl mb-1">{tab.icon}</Text>
            <Text className={`text-xs ${isFocused ? 'text-[#4FD1C5] font-semibold' : 'text-gray-600'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
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
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Main App */}
        <Stack.Screen name="Main">
          {(props) => (
            <View className="flex-1">
              <MainNavigator />
              <BottomTabBar {...props} />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
