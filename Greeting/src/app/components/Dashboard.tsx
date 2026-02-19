// Refactored Dashboard - Under 150 lines, using atomic components
import { useSubscriptions } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { StatCard } from './atoms/StatCard';
import { SubscriptionCard } from './molecules/SubscriptionCard';
import { TrialAlertCard } from './molecules/TrialAlertCard';
import { DollarSign, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Button } from './ui/button';

export function Dashboard() {
  const { user } = useAuth();
  const { subscriptions, getTotalMonthlyCost } = useSubscriptions();
  const navigate = useNavigate();

  const activeSubscriptions = subscriptions.filter((sub) => sub.status === 'active');
  
  const upcomingBills = activeSubscriptions
    .map((sub) => ({
      ...sub,
      daysUntil: differenceInDays(new Date(sub.nextBillDate), new Date()),
    }))
    .filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const trialsEnding = activeSubscriptions
    .filter((sub) => sub.isTrial && sub.trialEndDate)
    .map((sub) => ({
      ...sub,
      daysUntil: differenceInDays(new Date(sub.trialEndDate!), new Date()),
    }))
    .filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const totalMonthlyCost = getTotalMonthlyCost();
  const currencySymbol = user?.preferences.currency === 'THB' ? '฿' : '$';

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">Track your subscriptions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Monthly Cost"
            value={`${currencySymbol}${totalMonthlyCost.toFixed(0)}`}
            subtitle={`${activeSubscriptions.length} active`}
            icon={DollarSign}
          />
          <StatCard
            title="Upcoming"
            value={upcomingBills.length}
            subtitle="Next 30 days"
            icon={Calendar}
          />
        </div>

        {/* Trial Alerts */}
        {trialsEnding.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">⚠️ Trials Ending Soon</h2>
            {trialsEnding.map((sub) => (
              <TrialAlertCard
                key={sub.id}
                serviceName={sub.serviceName}
                daysRemaining={sub.daysUntil}
                onView={() => navigate(`/app/subscription/${sub.id}`)}
              />
            ))}
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
          
          {activeSubscriptions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No subscriptions yet</p>
              <Button 
                onClick={() => navigate('/app/add')}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Add Your First
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  {...sub}
                  onClick={(id) => navigate(`/app/subscription/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
