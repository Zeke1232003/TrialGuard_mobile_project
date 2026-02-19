// Molecule: Subscription Form Component
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

interface SubscriptionFormData {
  serviceName: string;
  category: string;
  monthlyCost: string;
  currency: string;
  billingCycle: string;
  nextBillDate: string;
  isTrial: boolean;
  trialEndDate: string;
  notes: string;
}

interface SubscriptionFormProps {
  formData: SubscriptionFormData;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
}

const categories = [
  'Entertainment',
  'Music',
  'Cloud Storage',
  'Productivity',
  'Gaming',
  'Shopping',
  'Telecom',
  'Other',
];

export function SubscriptionForm({
  formData,
  onChange,
  onSubmit,
  submitLabel = 'Add Subscription',
}: SubscriptionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service Name *</Label>
        <Input
          id="serviceName"
          placeholder="Netflix, Spotify, etc."
          value={formData.serviceName}
          onChange={(e) => onChange('serviceName', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => onChange('category', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="monthlyCost">Amount *</Label>
          <Input
            id="monthlyCost"
            type="number"
            step="0.01"
            placeholder="299"
            value={formData.monthlyCost}
            onChange={(e) => onChange('monthlyCost', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => onChange('currency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THB">THB (฿)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingCycle">Billing Cycle</Label>
        <Select
          value={formData.billingCycle}
          onValueChange={(value) => onChange('billingCycle', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextBillDate">Next Billing Date *</Label>
        <Input
          id="nextBillDate"
          type="date"
          value={formData.nextBillDate}
          onChange={(e) => onChange('nextBillDate', e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="isTrial"
          checked={formData.isTrial}
          onCheckedChange={(checked) => onChange('isTrial', checked)}
        />
        <Label htmlFor="isTrial" className="text-sm">
          This is a free trial
        </Label>
      </div>

      {formData.isTrial && (
        <div className="space-y-2">
          <Label htmlFor="trialEndDate">Trial End Date</Label>
          <Input
            id="trialEndDate"
            type="date"
            value={formData.trialEndDate}
            onChange={(e) => onChange('trialEndDate', e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes..."
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
        {submitLabel}
      </Button>
    </form>
  );
}
