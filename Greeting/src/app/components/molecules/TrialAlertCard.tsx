// Molecule: AlertCard for trial warnings
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface AlertCardProps {
  serviceName: string;
  daysRemaining: number;
  onView: () => void;
}

export function TrialAlertCard({ serviceName, daysRemaining, onView }: AlertCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
        <div>
          <p className="font-medium text-orange-900">{serviceName}</p>
          <p className="text-sm text-orange-700">
            Trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={onView} className="border-orange-300">
        View
      </Button>
    </div>
  );
}
