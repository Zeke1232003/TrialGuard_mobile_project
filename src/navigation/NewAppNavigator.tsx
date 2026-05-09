import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LandingScreen,
  LoginScreen,
  RegisterScreen,
  DashboardScreen,
  AddSubscriptionScreen,
  SubscriptionDetailScreen,
  CalendarScreen,
  SettingsScreen,
} from '../screens';

export type AppTabsParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  AppTabs: undefined;
  AddSubscription: { initialTab?: 'parse' | 'manual' } | undefined;
  SubscriptionDetail: { id?: string } | undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppTabs = createBottomTabNavigator<AppTabsParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppTabsNavigator() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleAddPress = () => {
    navigation.navigate('AddSubscription', { initialTab: 'manual' });
  };

  return (
    <View style={{ flex: 1 }}>
      <AppTabs.Navigator
        screenOptions={({ route }: { route: { name: keyof AppTabsParamList } }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            height: 64 + insets.bottom,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 8),
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <AppTabs.Screen name="Dashboard" component={DashboardScreen} />
        <AppTabs.Screen name="Calendar" component={CalendarScreen} />
        <AppTabs.Screen name="Settings" component={SettingsScreen} />
      </AppTabs.Navigator>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 80 + insets.bottom,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#3B82F6',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8,
        }}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export function NewAppNavigator() {
  return (
    <RootStack.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Landing" component={LandingScreen} />
      <RootStack.Screen name="AuthStack" component={AuthNavigator} />
      <RootStack.Screen name="AppTabs" component={AppTabsNavigator} />
      <RootStack.Screen name="AddSubscription" component={AddSubscriptionScreen} />
      <RootStack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{ headerShown: true, title: 'Subscription Details' }}
      />
    </RootStack.Navigator>
  );
}
