// Molecule: Detail Info Row
import { LucideIcon } from 'lucide-react';

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
}

export function DetailRow({ icon: Icon, label, value, subtitle }: DetailRowProps) {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-teal-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
