// Atom: StatCard component for displaying statistics
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
