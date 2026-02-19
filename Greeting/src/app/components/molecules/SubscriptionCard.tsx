// Molecule: SubscriptionCard component
import { Badge } from '../ui/badge';
import { format, differenceInDays } from 'date-fns';

interface SubscriptionCardProps {
  id: string;
  serviceName: string;
  category: string;
  monthlyCost: number;
  currency: string;
  nextBillDate: string;
  billingCycle: string;
  isTrial: boolean;
  onClick: (id: string) => void;
}

export function SubscriptionCard({
  id,
  serviceName,
  category,
  monthlyCost,
  currency,
  nextBillDate,
  billingCycle,
  isTrial,
  onClick,
}: SubscriptionCardProps) {
  const daysUntil = differenceInDays(new Date(nextBillDate), new Date());
  const currencySymbol = currency === 'THB' ? '฿' : '$';

  return (
    <div
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
      onClick={() => onClick(id)}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold text-gray-900">{serviceName}</h3>
          {isTrial && (
            <Badge className="bg-teal-100 text-teal-700 text-xs">Trial</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-1">{category}</p>
        <p className="text-xs text-gray-500">
          Next bill: {format(new Date(nextBillDate), 'MMM dd')} • {daysUntil} days
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {currencySymbol}
          {monthlyCost}
        </p>
        <p className="text-xs text-gray-500 capitalize">{billingCycle}</p>
      </div>
    </div>
  );
}
