import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Switch, TouchableOpacity } from 'react-native';
import { Button, Input, Card } from '../ui';

export function AddSubscriptionScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'parse' | 'manual'>('parse');
  const [pastedText, setPastedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [currency, setCurrency] = useState('THB');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillDate, setNextBillDate] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleParse = () => {
    if (!pastedText.trim()) {
      Alert.alert('Error', 'Please paste some text to parse');
      return;
    }

    // Simple parsing logic (mock)
    const text = pastedText.toLowerCase();
    
    // Try to extract service name
    if (text.includes('netflix')) setServiceName('Netflix');
    else if (text.includes('spotify')) setServiceName('Spotify');
    else if (text.includes('disney')) setServiceName('Disney+');
    else setServiceName('Unknown Service');

    // Try to extract amount
    const amountMatch = text.match(/\d+/);
    if (amountMatch) {
      setMonthlyCost(amountMatch[0]);
    }

    // Detect trial
    if (text.includes('trial') || text.includes('free')) {
      setIsTrial(true);
    }

    setShowPreview(true);
    Alert.alert('Success', 'Text analyzed! Review details below.');
  };

  const handleSubmit = () => {
    if (!serviceName || !monthlyCost || !nextBillDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Subscription added!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pb-24">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">Add Subscription</Text>
          <Text className="text-sm text-gray-600 mt-1">Paste receipt or enter manually</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-200 rounded-xl p-1 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('parse')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'parse' ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'parse' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              Paste Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              activeTab === 'manual' ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'manual' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              Manual Entry
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'parse' ? (
          <View>
            <Card className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Paste Receipt Text
              </Text>
              <TextInput
                className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900"
                placeholder="Paste email or SMS receipt here..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={pastedText}
                onChangeText={setPastedText}
              />
              <View className="mt-4">
                <Button onPress={handleParse}>
                  Parse Text
                </Button>
              </View>
            </Card>

            {/* Preview after parsing */}
            {showPreview && serviceName && (
              <Card className="mb-4 bg-teal-50 border border-teal-200">
                <Text className="font-semibold text-gray-900 mb-2">✓ Detected:</Text>
                <Text className="text-sm text-gray-700">Service: {serviceName}</Text>
                <Text className="text-sm text-gray-700">Amount: {currency} {monthlyCost}</Text>
                {isTrial && <Text className="text-sm text-orange-600">Trial detected!</Text>}
              </Card>
            )}
          </View>
        ) : null}

        {/* Manual Form (shown in manual tab OR after parsing) */}
        {(activeTab === 'manual' || showPreview) && (
          <Card>
            <Text className="text-sm font-medium text-gray-700 mb-4">
              {activeTab === 'manual' ? 'Enter Details' : 'Review & Edit'}
            </Text>

            <View className="gap-4">
              <Input
                label="Service Name *"
                placeholder="e.g., Netflix"
                value={serviceName}
                onChangeText={setServiceName}
              />

              <Input
                label="Category"
                placeholder="e.g., Entertainment"
                value={category}
                onChangeText={setCategory}
              />

              <Input
                label="Monthly Cost *"
                placeholder="0"
                value={monthlyCost}
                onChangeText={setMonthlyCost}
                keyboardType="numeric"
              />

              <Input
                label="Next Bill Date * (YYYY-MM-DD)"
                placeholder="2026-03-15"
                value={nextBillDate}
                onChangeText={setNextBillDate}
              />

              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm font-medium text-gray-700">Is Trial?</Text>
                <Switch
                  value={isTrial}
                  onValueChange={setIsTrial}
                  trackColor={{ true: '#4FD1C5', false: '#d1d5db' }}
                />
              </View>

              {isTrial && (
                <Input
                  label="Trial End Date (YYYY-MM-DD)"
                  placeholder="2026-02-25"
                  value={trialEndDate}
                  onChangeText={setTrialEndDate}
                />
              )}

              <Input
                label="Notes"
                placeholder="Optional notes..."
                value={notes}
                onChangeText={setNotes}
              />

              <Button onPress={handleSubmit}>
                Save Subscription
              </Button>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}
