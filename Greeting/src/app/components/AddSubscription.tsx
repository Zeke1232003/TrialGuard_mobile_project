// Refactored AddSubscription - Under 150 lines using atomic components
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSubscriptions } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { parseEmailOrSMS } from '../utils/parser';
import { TextParser } from './molecules/TextParser';
import { SubscriptionForm } from './molecules/SubscriptionForm';
import { ConfirmationPreview } from './molecules/ConfirmationPreview';
import { format } from 'date-fns';

export function AddSubscription() {
  const navigate = useNavigate();
  const { addSubscription } = useSubscriptions();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'Entertainment',
    monthlyCost: '',
    currency: user?.preferences.currency || 'THB',
    billingCycle: 'monthly',
    nextBillDate: '',
    isTrial: false,
    trialEndDate: '',
    notes: '',
  });

  const handleParse = (text: string) => {
    const parsed = parseEmailOrSMS(text);
    setFormData({
      ...formData,
      serviceName: parsed.serviceName || formData.serviceName,
      monthlyCost: parsed.amount?.toString() || formData.monthlyCost,
      currency: parsed.currency || formData.currency,
      nextBillDate: parsed.billingDate || formData.nextBillDate,
      isTrial: parsed.isTrial || formData.isTrial,
    });
    setShowPreview(true);
    toast.success('Text analyzed! Review details below.');
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceName || !formData.monthlyCost || !formData.nextBillDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addSubscription({
      serviceName: formData.serviceName,
      category: formData.category,
      monthlyCost: parseFloat(formData.monthlyCost),
      currency: formData.currency,
      billingCycle: formData.billingCycle as any,
      nextBillDate: formData.nextBillDate,
      isTrial: formData.isTrial,
      trialEndDate: formData.isTrial ? formData.trialEndDate : undefined,
      status: 'active',
      notes: formData.notes,
    });

    toast.success('Subscription added!');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Subscription</h1>
          <p className="text-sm text-gray-600 mt-1">Paste receipt or enter manually</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <div className="bg-white rounded-2xl p-4">
              <TextParser onParse={handleParse} />
            </div>

            {/* Confirmation Preview */}
            {showPreview && formData.serviceName && formData.monthlyCost && (
              <div>
                <ConfirmationPreview
                  serviceName={formData.serviceName}
                  cost={parseFloat(formData.monthlyCost)}
                  currency={formData.currency}
                  trialEndDate={
                    formData.isTrial && formData.trialEndDate
                      ? format(new Date(formData.trialEndDate), 'MMM dd, yyyy')
                      : undefined
                  }
                />
                <div className="bg-white rounded-2xl p-4 mt-4">
                  <SubscriptionForm
                    formData={formData}
                    onChange={handleFieldChange}
                    onSubmit={handleSubmit}
                    submitLabel="Save"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual">
            <div className="bg-white rounded-2xl p-4">
              <SubscriptionForm
                formData={formData}
                onChange={handleFieldChange}
                onSubmit={handleSubmit}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
