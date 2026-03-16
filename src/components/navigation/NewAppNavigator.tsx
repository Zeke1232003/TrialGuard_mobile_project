import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import {
  LoginScreen,
  RegisterScreen,
  DashboardScreen,
  AddSubscriptionScreen,
  SubscriptionDetailScreen,
  CalendarScreen,
  SettingsScreen,
} from '../screens';

export type MainTabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AddSubscription: undefined;
  SubscriptionDetail: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }: { route: { name: keyof MainTabParamList } }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#4FD1C5',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            height: 64,
            paddingTop: 6,
            paddingBottom: 8,
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
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 80,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#4FD1C5',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 8,
        }}
        onPress={() => navigation.navigate('AddSubscription' as never)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export function NewAppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AddSubscription" component={AddSubscriptionScreen} />
      <Stack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{ headerShown: true, title: 'Subscription Details' }}
      />
    </Stack.Navigator>
  );
}
