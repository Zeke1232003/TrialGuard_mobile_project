import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function CalendarScreen({ navigation }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { width } = useWindowDimensions();
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const calendarCellSize = useMemo(() => {
    const screenPadding = 32;
    const cardHorizontalPadding = 32;
    const computedSize = (width - screenPadding - cardHorizontalPadding) / 7;
    return Math.max(36, Math.min(computedSize, 56));
  }, [width]);

  const titleFontSize = width < 360 ? 18 : 20;
  const dayNumberFontSize = width < 360 ? 12 : 14;

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create bills map by date
    const billsByDate: { [key: number]: typeof subscriptions } = {};
    
    subscriptions.forEach((sub) => {
      const billDate = new Date(sub.nextBillingDate);
      if (billDate.getMonth() === month && billDate.getFullYear() === year) {
        const day = billDate.getDate();
        if (!billsByDate[day]) {
          billsByDate[day] = [];
        }
        billsByDate[day].push(sub);
      }
    });

    return {
      year,
      month,
      daysInMonth,
      startingDayOfWeek,
      billsByDate,
    };
  }, [currentDate, subscriptions]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const { daysInMonth, startingDayOfWeek, billsByDate } = calendarData;

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} style={{ width: calendarCellSize, height: calendarCellSize }} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasBills = billsByDate[day] && billsByDate[day].length > 0;
      const billCount = hasBills ? billsByDate[day].length : 0;
      const isToday = 
        day === new Date().getDate() &&
        calendarData.month === new Date().getMonth() &&
        calendarData.year === new Date().getFullYear();

      days.push(
        <View key={day} style={{ width: calendarCellSize, height: calendarCellSize, padding: 2 }}>
          <View
            className={`flex-1 items-center justify-center rounded-lg ${
              isToday ? 'bg-blue-100 border-2 border-[#3B82F6]' : ''
            } ${hasBills ? 'bg-blue-50' : ''}`}
          >
            <Text
              className={isToday ? 'font-bold text-[#3B82F6]' : 'text-gray-900'}
              style={{ fontSize: dayNumberFontSize }}
            >
              {day}
            </Text>
            {hasBills && (
              <View className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full mt-1" />
            )}
            {billCount > 0 && (
              <Text className="text-gray-600 mt-0.5" style={{ fontSize: width < 360 ? 10 : 12 }}>
                {billCount}
              </Text>
            )}
          </View>
        </View>
      );
    }

    return days;
  };

  const renderBillsList = () => {
    const bills = Object.entries(calendarData.billsByDate)
      .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
      .map(([day, subs]) => ({
        day: parseInt(day),
        subscriptions: subs,
        total: subs.reduce((sum, sub) => sum + sub.cost, 0),
      }));

    if (bills.length === 0) {
      return (
        <Card className="items-center py-8">
          <Ionicons name="calendar" size={48} color="#9CA3AF" style={{ marginBottom: 8 }} />
          <Text className="text-gray-600">No bills this month</Text>
        </Card>
      );
    }

    return (
      <View className="gap-3">
        {bills.map(({ day, subscriptions, total }) => (
          <Card key={day}>
            <View className="flex-row items-start justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">
                {monthNames[calendarData.month]} {day}
              </Text>
              <Text className="text-sm text-gray-600 text-right" style={{ maxWidth: '45%' }}>
                ฿{total.toFixed(0)} • {subscriptions.length} bill{subscriptions.length > 1 ? 's' : ''}
              </Text>
            </View>
            {subscriptions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                onPress={() => navigation.navigate('SubscriptionDetail', { id: sub.id })}
                className="flex-row items-center justify-between py-2 border-t border-gray-100"
              >
                <Text className="text-gray-900">{sub.name}</Text>
                <Text className="font-medium text-gray-900">฿{sub.cost}</Text>
              </TouchableOpacity>
            ))}
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pb-24">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={handlePreviousMonth}
            className="w-10 h-10 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text className="font-bold text-gray-900" style={{ fontSize: titleFontSize }}>
            {monthNames[calendarData.month]} {calendarData.year}
          </Text>

          <TouchableOpacity
            onPress={handleNextMonth}
            className="w-10 h-10 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Ionicons name="chevron-forward" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <Card className="mb-6">
          {/* Day names */}
          <View className="flex-row mb-2 self-center" style={{ width: calendarCellSize * 7 }}>
            {dayNames.map((day) =>(
              <View key={day} style={{ width: calendarCellSize }} className="items-center">
                <Text className="text-xs font-medium text-gray-600">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar days */}
          <View className="flex-row flex-wrap self-center" style={{ width: calendarCellSize * 7 }}>
            {renderCalendarDays()}
          </View>
        </Card>

        {/* Bills List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Bills This Month
          </Text>
          {renderBillsList()}
        </View>
      </View>
    </ScrollView>
  );
}
