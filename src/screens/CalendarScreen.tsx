import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui';
import { mockSubscriptions } from '../data/mockData';

export function CalendarScreen({ navigation }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());

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
    const billsByDate: { [key: number]: typeof mockSubscriptions } = {};
    
    mockSubscriptions.forEach((sub) => {
      const billDate = new Date(sub.nextBillDate);
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
  }, [currentDate]);

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
      days.push(<View key={`empty-${i}`} className="flex-1 aspect-square" />);
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
        <View key={day} className="flex-1 aspect-square p-1">
          <View
            className={`flex-1 items-center justify-center rounded-lg ${
              isToday ? 'bg-teal-100 border-2 border-[#4FD1C5]' : ''
            } ${hasBills ? 'bg-blue-50' : ''}`}
          >
            <Text className={`text-sm ${isToday ? 'font-bold text-[#4FD1C5]' : 'text-gray-900'}`}>
              {day}
            </Text>
            {hasBills && (
              <View className="w-1.5 h-1.5 bg-[#4FD1C5] rounded-full mt-1" />
            )}
            {billCount > 0 && (
              <Text className="text-xs text-gray-600 mt-0.5">{billCount}</Text>
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
        total: subs.reduce((sum, sub) => sum + sub.monthlyCost, 0),
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
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">
                {monthNames[calendarData.month]} {day}
              </Text>
              <Text className="text-sm text-gray-600">
                ฿{total.toFixed(0)} • {subscriptions.length} bill{subscriptions.length > 1 ? 's' : ''}
              </Text>
            </View>
            {subscriptions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                onPress={() => navigation.navigate('SubscriptionDetail', { id: sub.id })}
                className="flex-row items-center justify-between py-2 border-t border-gray-100"
              >
                <Text className="text-gray-900">{sub.serviceName}</Text>
                <Text className="font-medium text-gray-900">฿{sub.monthlyCost}</Text>
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
            <Text className="text-xl text-gray-900">←</Text>
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-900">
            {monthNames[calendarData.month]} {calendarData.year}
          </Text>

          <TouchableOpacity
            onPress={handleNextMonth}
            className="w-10 h-10 items-center justify-center bg-white rounded-lg shadow-sm"
          >
            <Text className="text-xl text-gray-900">→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <Card className="mb-6">
          {/* Day names */}
          <View className="flex-row mb-2">
            {dayNames.map((day) =>(
              <View key={day} className="flex-1 items-center">
                <Text className="text-xs font-medium text-gray-600">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar days */}
          <View className="flex-row flex-wrap">
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
