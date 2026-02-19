// Refactored Calendar - Under 150 lines
import { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const { subscriptions } = useSubscriptions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const currencySymbol = user?.preferences.currency === 'THB' ? '฿' : '$';

  const getSubscriptionsForDay = (day: Date) => {
    return subscriptions.filter(
      (sub) => sub.status === 'active' && isSameDay(new Date(sub.nextBillDate), day)
    );
  };

  const getDayTotal = (day: Date) => {
    return getSubscriptionsForDay(day).reduce((total, sub) => total + sub.monthlyCost, 0);
  };

  const firstDayOfMonth = monthStart.getDay();
  const calendarDays = [...Array(firstDayOfMonth).fill(null), ...daysInMonth];
  const today = new Date();

  const billDays = daysInMonth
    .filter((day) => getSubscriptionsForDay(day).length > 0)
    .sort((a, b) => a.getTime() - b.getTime());

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-600 mt-1">Your bill schedule</p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-bold text-gray-900">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const daySubs = getSubscriptionsForDay(day);
              const dayTotal = getDayTotal(day);
              const isToday = isSameDay(day, today);
              const hasBills = daySubs.length > 0;

              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square p-1 rounded-lg text-center ${
                    isToday ? 'bg-teal-100 border border-teal-500' : hasBills ? 'bg-teal-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium text-gray-900">{format(day, 'd')}</div>
                  {hasBills && (
                    <div className="text-[10px] font-semibold text-teal-600 mt-0.5">
                      {currencySymbol}
                      {dayTotal.toFixed(0)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bills This Month */}
        {billDays.length > 0 && (
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Bills This Month</h2>
            <div className="space-y-3">
              {billDays.map((day) => {
                const daySubs = getSubscriptionsForDay(day);
                const dayTotal = getDayTotal(day);

                return (
                  <div key={day.toISOString()}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {format(day, 'MMM d')}
                      </span>
                      <Badge className="bg-teal-100 text-teal-700">
                        {currencySymbol}
                        {dayTotal.toFixed(2)}
                      </Badge>
                    </div>
                    {daySubs.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => navigate(`/app/subscription/${sub.id}`)}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
                      >
                        <span className="text-sm text-gray-900">{sub.serviceName}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {currencySymbol}
                          {sub.monthlyCost}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
