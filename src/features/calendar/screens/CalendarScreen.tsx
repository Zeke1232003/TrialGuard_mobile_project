/**
 * Calendar Screen
 * Shows billing dates in calendar view with upcoming bills list
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarScreenProps } from '@/app/navigation.types';
import { useSubscriptionStore } from '@store/subscriptionStore';
import { formatCurrency } from '@core/utils';
import { ROUTES } from '@/app/routes';

const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Generate calendar days for current month with real subscription billing dates
  const generateCalendarDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get all billing dates from subscriptions
    const billingDates = new Set(
      subscriptions.map(sub => {
        const billDate = new Date(sub.nextBillingDate);
        return billDate.getMonth() === month ? billDate.getDate() : null;
      }).filter(Boolean)
    );
    
    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', disabled: true });
    }
    
    // Add actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isToday: i === today,
        hasBill: billingDates.has(i),
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get upcoming bills from real subscription data
  const upcomingBills = subscriptions
    .filter(sub => sub.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5) // Show next 5 upcoming bills
    .map(sub => ({
      id: sub.id,
      name: sub.name,
      cost: sub.cost,
      currency: sub.currency,
      date: new Date(sub.nextBillingDate),
    }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="items-center py-6">
          <Text className="text-xl font-bold text-gray-900">
            {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
          </Text>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row justify-around pb-4">
            {['Sun', 'Mo', 'Tu', 'Wu', 'Th', 'Fr', 'Su'].map((day, index) => (
              <Text
                key={index}
                className={`text-sm font-medium text-center w-10 ${index === 0 ? 'text-danger' : 'text-gray-500'}`}
              >
                {day}
              </Text>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {calendarDays.map((dayObj, index) => (
              <TouchableOpacity
                key={index}
                className={`w-[14.28%] aspect-square justify-center items-center relative ${
                  dayObj.isToday ? 'bg-primary rounded-full' : ''
                } ${dayObj.disabled ? 'opacity-0' : ''}`}
                onPress={() => !dayObj.disabled && typeof dayObj.day === 'number' && setSelectedDate(dayObj.day)}
                disabled={dayObj.disabled}
              >
                <Text
                  className={`text-base font-medium ${
                    dayObj.isToday ? 'text-white font-bold' : dayObj.disabled ? 'text-gray-300' : 'text-gray-900'
                  }`}
                >
                  {dayObj.day}
                </Text>
                {dayObj.hasBill && (
                  <View className="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-2" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</Text>
          {upcomingBills.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-400 text-center">No upcoming bills</Text>
              <Text className="text-gray-400 text-sm text-center mt-2">Add subscriptions to see them here</Text>
            </View>
          ) : (
            upcomingBills.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => navigation.navigate(ROUTES.SUBSCRIPTION_DETAIL, { subscriptionId: bill.id })}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-xl justify-center items-center mr-4">
                  <Text className="text-xl">
                    {bill.name.toLowerCase().includes('netflix') ? '📺' : 
                     bill.name.toLowerCase().includes('spotify') ? '🎵' : 
                     bill.name.toLowerCase().includes('youtube') ? '▶️' : 
                     bill.name.toLowerCase().includes('amazon') ? '📦' : '📱'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">{bill.name}</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {bill.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <Text className="text-base font-semibold text-gray-900">
                  {formatCurrency(bill.cost, bill.currency)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View className="flex-row justify-around items-center py-4 pb-6 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Text className="text-2xl mb-1">🏠</Text>
          <Text className="text-xs text-gray-500">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.ADD_SUBSCRIPTION)}>
          <Text className="text-2xl mb-1">➕</Text>
          <Text className="text-xs text-gray-500">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1">
          <Text className="text-2xl mb-1">📅</Text>
          <Text className="text-xs text-gray-500">Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Text className="text-2xl mb-1">⚙️</Text>
          <Text className="text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
