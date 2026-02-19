// Molecule: Confirmation Preview Card for parsed subscription
import { Badge } from '../ui/badge';

interface ConfirmationPreviewProps {
  serviceName: string;
  cost: number;
  currency: string;
  trialEndDate?: string;
}

export function ConfirmationPreview({
  serviceName,
  cost,
  currency,
  trialEndDate,
}: ConfirmationPreviewProps) {
  const currencySymbol = currency === 'THB' ? '฿' : '$';

  return (
    <div className="bg-teal-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Confirmation Preview</h3>
      </div>

      <div className="bg-white rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">{serviceName.charAt(0)}</span>
            </div>
            <span className="font-medium text-gray-900">{serviceName}</span>
          </div>
          <span className="font-bold text-gray-900">
            {cost} {currency}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-gray-600">Cost</span>
          <span className="font-semibold text-gray-900">
            {cost} {currency}
          </span>
        </div>

        {trialEndDate && (
          <div className="text-center pt-2 border-t">
            <p className="text-sm text-gray-600">Trial ends: {trialEndDate}</p>
          </div>
        )}
      </div>
    </div>
  );
}
