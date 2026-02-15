/**
 * Add Subscription Screen
 * Allows users to add subscriptions by pasting text or manual entry
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddSubscriptionScreenProps } from '@/app/navigation.types';
import { useSubscriptionStore } from '@store/subscriptionStore';
import { Subscription } from '@models/Subscription';
import { ROUTES } from '@/app/routes';
import { parseSubscriptionText } from '@services/parsing';

const AddSubscriptionScreen: React.FC<AddSubscriptionScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'manual'>('paste');
  const [pasteText, setPasteText] = useState('');
  const [previewData, setPreviewData] = useState<Partial<Subscription> | null>(null);
  const [saving, setSaving] = useState(false);
  const { addSubscription } = useSubscriptionStore();

  const handleAnalyze = () => {
    const trimmed = pasteText.trim();
    if (!trimmed) {
      setPreviewData(null);
      return;
    }
    const parsed = parseSubscriptionText(trimmed);
    setPreviewData({
      name: parsed.name ?? 'Unknown Service',
      cost: parsed.cost ?? 0,
      currency: parsed.currency ?? '฿',
      billingCycle: parsed.billingCycle ?? 'monthly',
      nextBillingDate: parsed.nextBillingDate ?? new Date(),
      trialEndDate: parsed.trialEndDate,
    });
  };

  const handleSave = async () => {
    if (!previewData?.name || saving) return;
    setSaving(true);
    try {
      await addSubscription({
        userId: '1',
        name: previewData.name,
        cost: previewData.cost || 0,
        currency: previewData.currency || '฿',
        billingCycle: previewData.billingCycle || 'monthly',
        nextBillingDate: previewData.nextBillingDate || new Date(),
        trialEndDate: previewData.trialEndDate,
        status: previewData.trialEndDate ? 'trial' : 'active',
        source: 'email',
        reminderEnabled: true,
        reminderDays: 2,
      });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="pt-4 px-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-primary font-medium">← Back</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-6 my-6">
          <TouchableOpacity
            className={`flex-1 py-2 items-center rounded-xl mx-1 ${activeTab === 'paste' ? 'bg-primary-light' : ''}`}
            onPress={() => setActiveTab('paste')}
          >
            <Text className={`text-sm font-medium ${activeTab === 'paste' ? 'text-gray-900' : 'text-gray-500'}`}>
              Paste Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 items-center rounded-xl mx-1 ${activeTab === 'manual' ? 'bg-primary-light' : ''}`}
            onPress={() => setActiveTab('manual')}
          >
            <Text className={`text-sm font-medium ${activeTab === 'manual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Manual Entry
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6">Add Subscription</Text>

          {activeTab === 'paste' ? (
            <View>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-[120px] text-base mb-6"
                placeholder="Paste your email or SMS receipt here"
                placeholderTextColor="#6B7280"
                multiline
                value={pasteText}
                onChangeText={setPasteText}
                textAlignVertical="top"
              />

              <TouchableOpacity className="bg-primary rounded-xl py-4 items-center mb-6" onPress={handleAnalyze}>
                <Text className="text-base font-semibold text-white">Analyze</Text>
              </TouchableOpacity>

              {previewData && (
                <View className="bg-primary-light rounded-xl p-4 mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-4">Confirmation Preview</Text>
                  <View className="flex-row justify-between items-center py-1">
                    <Text className="text-sm text-gray-500">Service</Text>
                    <Text className="text-sm font-medium text-gray-900">{previewData.name}</Text>
                  </View>
                  <View className="flex-row justify-between items-center py-1">
                    <Text className="text-sm text-gray-500">Cost</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {previewData.currency}{previewData.cost} / {previewData.billingCycle}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center py-1">
                    <Text className="text-sm text-gray-500">Billing Cycle</Text>
                    <Text className="text-sm font-medium text-gray-900">{previewData.billingCycle}</Text>
                  </View>
                  {previewData.trialEndDate && (
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-sm text-gray-500">End date</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {previewData.trialEndDate.toDateString()}
                      </Text>
                    </View>
                  )}
                  {previewData.nextBillingDate && (
                    <View className="flex-row justify-between items-center py-1">
                      <Text className="text-sm text-gray-500">Next billing</Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {previewData.nextBillingDate.toDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View className="items-center py-12">
              <Text className="text-base text-gray-500 italic">Manual entry form coming soon...</Text>
            </View>
          )}

          {previewData && (
            <TouchableOpacity
              className={`bg-primary rounded-xl py-4 items-center ${saving ? 'opacity-60' : ''}`}
              onPress={handleSave}
              disabled={saving}
            >
              <Text className="text-base font-semibold text-white">{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View className="flex-row justify-around items-center py-4 pb-6 border-t border-gray-200 bg-white">
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.HOME)}>
          <Text className="text-2xl mb-1">🏠</Text>
          <Text className="text-xs text-gray-500">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1">
          <Text className="text-2xl mb-1">➕</Text>
          <Text className="text-xs text-gray-500">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.CALENDAR)}>
          <Text className="text-2xl mb-1">📅</Text>
          <Text className="text-xs text-gray-500">Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1" onPress={() => navigation.navigate(ROUTES.SETTINGS)}>
          <Text className="text-2xl mb-1">⚙️</Text>
          <Text className="text-xs text-gray-500">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddSubscriptionScreen;
