// Refactored SubscriptionDetail - Under 150 lines
import { useParams, useNavigate } from 'react-router';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { DetailRow } from './molecules/DetailRow';
import { ArrowLeft, Calendar, DollarSign, Tag, Trash2, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

export function SubscriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSubscription, deleteSubscription, updateSubscription } = useSubscriptions();
  const { user } = useAuth();

  const subscription = getSubscription(id || '');

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Subscription not found</p>
          <Button onClick={() => navigate('/app')} className="bg-teal-500 hover:bg-teal-600">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const daysUntil = differenceInDays(new Date(subscription.nextBillDate), new Date());
  const currencySymbol = user?.preferences.currency === 'THB' ? '฿' : '$';
  const yearlyEstimate =
    subscription.billingCycle === 'monthly'
      ? subscription.monthlyCost * 12
      : subscription.billingCycle === 'yearly'
      ? subscription.monthlyCost
      : subscription.monthlyCost * 52;

  const handleDelete = () => {
    deleteSubscription(subscription.id);
    toast.success('Subscription deleted');
    navigate('/app');
  };

  const handleToggleStatus = () => {
    const newStatus = subscription.status === 'active' ? 'cancelled' : 'active';
    updateSubscription(subscription.id, { status: newStatus });
    toast.success(`Subscription ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/app')}
          className="flex items-center text-gray-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{subscription.serviceName}</h1>
              <div className="flex items-center space-x-2">
                <Badge className={subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {subscription.status}
                </Badge>
                {subscription.isTrial && <Badge className="bg-orange-100 text-orange-700">Trial</Badge>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {currencySymbol}
                {subscription.monthlyCost}
              </div>
              <p className="text-sm text-gray-500 capitalize">{subscription.billingCycle}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 mb-6">
            <DetailRow
              icon={Tag}
              label="Category"
              value={subscription.category}
            />
            <DetailRow
              icon={Calendar}
              label="Next Bill Date"
              value={format(new Date(subscription.nextBillDate), 'MMM dd, yyyy')}
              subtitle={`${daysUntil} days away`}
            />
            <DetailRow
              icon={DollarSign}
              label="Yearly Estimate"
              value={`${currencySymbol}${yearlyEstimate.toFixed(2)}`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleToggleStatus}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {subscription.status === 'active' ? 'Cancel' : 'Reactivate'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {subscription.serviceName}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
