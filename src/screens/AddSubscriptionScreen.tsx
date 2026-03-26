import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Switch, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Input, Card } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function AddSubscriptionScreen({ navigation }: any) {
  const [pastedText, setPastedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthStore();
  const { addSubscription } = useSubscriptionStore();

  // Form state
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [monthlyCost, setMonthlyCost] = useState('');
  const [currency, setCurrency] = useState('THB');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextBillDate, setNextBillDate] = useState('');
  const [isTrial, setIsTrial] = useState(false);
  const [trialEndDate, setTrialEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<{
    library: 'Ionicons' | 'MaterialCommunityIcons';
    name: string;
    color: string;
  } | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Predefined icon options
  const iconOptions = [
    { library: 'MaterialCommunityIcons' as const, name: 'filmstrip', color: '#E50914', label: 'Netflix' },
    { library: 'MaterialCommunityIcons' as const, name: 'spotify', color: '#1DB954', label: 'Spotify' },
    { library: 'MaterialCommunityIcons' as const, name: 'castle', color: '#113CCF', label: 'Disney+' },
    { library: 'Ionicons' as const, name: 'logo-youtube', color: '#FF0000', label: 'YouTube' },
    { library: 'MaterialCommunityIcons' as const, name: 'alpha-a-box', color: '#FF0000', label: 'Adobe' },
    { library: 'MaterialCommunityIcons' as const, name: 'file-document', color: '#000000', label: 'Notion' },
    { library: 'Ionicons' as const, name: 'musical-notes', color: '#FF6B6B', label: 'Music' },
    { library: 'Ionicons' as const, name: 'game-controller', color: '#4ECDC4', label: 'Gaming' },
    { library: 'Ionicons' as const, name: 'fitness', color: '#FF6348', label: 'Fitness' },
    { library: 'MaterialCommunityIcons' as const, name: 'cloud', color: '#4A90E2', label: 'Cloud' },
  ];

  const formatDateToYmd = (dateInput: string): string | null => {
    const trimmed = dateInput.trim();
    if (!trimmed) return null;

    const monthMap: Record<string, string> = {
      january: '01', jan: '01',
      february: '02', feb: '02',
      march: '03', mar: '03',
      april: '04', apr: '04',
      may: '05',
      june: '06', jun: '06',
      july: '07', jul: '07',
      august: '08', aug: '08',
      september: '09', sep: '09', sept: '09',
      october: '10', oct: '10',
      november: '11', nov: '11',
      december: '12', dec: '12',
    };

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Parse "Month DD, YYYY" safely without relying on Date text parsing
    const monthDayYear = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
    if (monthDayYear) {
      const monthName = monthDayYear[1].toLowerCase();
      const day = monthDayYear[2].padStart(2, '0');
      const year = monthDayYear[3];
      const month = monthMap[monthName];

      if (month) {
        return `${year}-${month}-${day}`;
      }
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleParse = () => {
    if (!pastedText.trim()) {
      Alert.alert('Error', 'Please paste some text to parse');
      return;
    }

    const text = pastedText.toLowerCase();
    let parsedServiceName = '';
    let parsedCategory = category;
    let parsedMonthlyCost = monthlyCost;
    let parsedCurrency = currency;
    let parsedBillingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
    let parsedNextBillDate = nextBillDate;
    let parsedIsTrial = false;
    let parsedNotes = notes;
    let parsedIcon = selectedIcon;

    const pickIconForText = (value: string) => {
      const lower = value.toLowerCase();
      if (lower.includes('netflix')) return iconOptions[0];
      if (lower.includes('spotify')) return iconOptions[1];
      if (lower.includes('disney')) return iconOptions[2];
      if (lower.includes('youtube')) return iconOptions[3];
      if (lower.includes('adobe')) return iconOptions[4];
      if (lower.includes('notion')) return iconOptions[5];
      return null;
    };

    const normalizeServiceName = (value: string): string => {
      const lower = value.toLowerCase();
      if (lower.includes('netflix')) return 'Netflix';
      if (lower.includes('spotify')) return 'Spotify';
      if (lower.includes('disney')) return 'Disney+';
      if (lower.includes('youtube')) return 'YouTube Premium';
      if (lower.includes('amazon')) return 'Amazon Prime';
      return value.trim();
    };

    const parseAmountAndCurrency = (value: string): { amount?: string; currency?: string } => {
      const upper = value.toUpperCase();
      let detectedCurrency: string | undefined;

      if (upper.includes('THB') || value.includes('฿')) detectedCurrency = 'THB';
      else if (upper.includes('USD') || value.includes('$')) detectedCurrency = 'USD';
      else if (upper.includes('EUR') || value.includes('€')) detectedCurrency = 'EUR';
      else if (upper.includes('GBP') || value.includes('£')) detectedCurrency = 'GBP';

      const amountMatch = value.match(/(\d+(?:[.,]\d{1,2})?)/);
      return {
        amount: amountMatch?.[1] ? amountMatch[1].replace(',', '.') : undefined,
        currency: detectedCurrency,
      };
    };

    const productLine = pastedText.match(/product\s*:\s*([^\n\r]+)/i)?.[1]?.trim();
    if (productLine) {
      parsedServiceName = normalizeServiceName(productLine);
      parsedIcon = pickIconForText(parsedServiceName) || parsedIcon;
    }

    // Parse labeled plan line if present (e.g., "Plan: Premium Monthly Plan")
    const planLineMatch = pastedText.match(/plan\s*:\s*([^\n\r]+)/i);
    if (planLineMatch?.[1]) {
      const planText = planLineMatch[1].trim();
      if (!parsedServiceName) {
        parsedServiceName = normalizeServiceName(planText);
        parsedIcon = pickIconForText(parsedServiceName) || parsedIcon;
      }

      const planLower = planText.toLowerCase();
      if (planLower.includes('year')) parsedBillingCycle = 'yearly';
      else if (planLower.includes('week')) parsedBillingCycle = 'weekly';
      else if (planLower.includes('day')) parsedBillingCycle = 'daily';
      else parsedBillingCycle = 'monthly';
    }

    // Fallback service detection from content if no labeled plan
    if (!parsedServiceName) {
      if (text.includes('netflix')) parsedServiceName = 'Netflix';
      else if (text.includes('spotify')) parsedServiceName = 'Spotify';
      else if (text.includes('disney')) parsedServiceName = 'Disney+';
      else if (text.includes('youtube')) parsedServiceName = 'YouTube Premium';
      else if (text.includes('amazon')) parsedServiceName = 'Amazon Prime';

      if (!parsedIcon) {
        parsedIcon = pickIconForText(parsedServiceName || text) || parsedIcon;
      }
    }

    // Try to extract real currency amount only (ignore card digits and dates)
    const billingAmountLine = pastedText.match(/billing\s*amount\s*:\s*([^\n\r]+)/i)?.[1]?.trim();
    if (billingAmountLine) {
      const parsedAmount = parseAmountAndCurrency(billingAmountLine);
      if (parsedAmount.amount) {
        parsedMonthlyCost = parsedAmount.amount;
      }
      if (parsedAmount.currency) {
        parsedCurrency = parsedAmount.currency;
      }
    }

    if (!parsedMonthlyCost) {
      const amountMatch = pastedText.match(/(?:amount|price|cost|total|paid)?[^\n\r]*(?:\$|฿|€|£)\s*(\d+(?:[.,]\d{1,2})?)/i);
      if (amountMatch?.[1]) {
        parsedMonthlyCost = amountMatch[1].replace(',', '.');
      }
    }

    // Parse explicit renewal/start labels first, then fallback to generic date in text
    const renewalLine = pastedText.match(/renewal\s*date\s*:\s*([^\n\r]+)/i)?.[1]?.trim();
    const startLine = pastedText.match(/start\s*date\s*:\s*([^\n\r]+)/i)?.[1]?.trim();

    const parsedRenewal = renewalLine ? formatDateToYmd(renewalLine) : null;
    const parsedStart = startLine ? formatDateToYmd(startLine) : null;

    if (parsedRenewal) {
      parsedNextBillDate = parsedRenewal;
    } else if (parsedStart) {
      parsedNextBillDate = parsedStart;
    } else {
      const fallbackDate = pastedText.match(/\b([A-Za-z]+\s+\d{1,2},\s*\d{4}|\d{4}-\d{2}-\d{2})\b/);
      if (fallbackDate?.[1]) {
        const parsedFallback = formatDateToYmd(fallbackDate[1]);
        if (parsedFallback) {
          parsedNextBillDate = parsedFallback;
        }
      }
    }

    // Optional notes from payment method line
    const paymentMethodLine = pastedText.match(/payment\s*method\s*:\s*([^\n\r]+)/i)?.[1]?.trim();
    if (paymentMethodLine) {
      parsedNotes = `Payment Method: ${paymentMethodLine}`;
    }

    // Infer category from text/plan
    const categorySource = `${parsedServiceName} ${text}`.toLowerCase();
    if (categorySource.includes('music') || categorySource.includes('spotify')) parsedCategory = 'Music';
    else if (categorySource.includes('productivity') || categorySource.includes('adobe') || categorySource.includes('notion')) parsedCategory = 'Productivity';
    else if (categorySource.includes('cloud')) parsedCategory = 'Cloud';
    else if (categorySource.includes('fitness')) parsedCategory = 'Fitness';
    else parsedCategory = parsedCategory || 'Entertainment';

    // Detect keywords for trial or expiry
    if (text.includes('trial') || text.includes('free')) {
      parsedIsTrial = true;
    }
    if (text.includes('expire') || text.includes('expiry') || text.includes('end')) {
      parsedIsTrial = true;
    }

    setServiceName(parsedServiceName || serviceName || 'Unknown Service');
    setCategory(parsedCategory);
    setMonthlyCost(parsedMonthlyCost);
    setCurrency(parsedCurrency);
    setBillingCycle(parsedBillingCycle);
    setNextBillDate(parsedNextBillDate);
    setIsTrial(parsedIsTrial);
    setNotes(parsedNotes);
    if (parsedIcon) {
      setSelectedIcon(parsedIcon);
    }

    setShowPreview(true);
    Alert.alert('Success', 'Text analyzed! Review details below.');
  };

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    if (!serviceName || !monthlyCost || !nextBillDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a subscription');
      return;
    }

    const parsedCost = Number(monthlyCost);
    if (Number.isNaN(parsedCost) || parsedCost < 0) {
      Alert.alert('Error', 'Monthly cost must be a valid number');
      return;
    }

    const parsedNextDate = new Date(nextBillDate);
    if (Number.isNaN(parsedNextDate.getTime())) {
      Alert.alert('Error', 'Next bill date must be valid (YYYY-MM-DD)');
      return;
    }

    const parsedTrialDate = trialEndDate ? new Date(trialEndDate) : undefined;
    if (trialEndDate && (!parsedTrialDate || Number.isNaN(parsedTrialDate.getTime()))) {
      Alert.alert('Error', 'Trial end date must be valid (YYYY-MM-DD)');
      return;
    }

    try {
      setIsSaving(true);
      await addSubscription({
        userId: user.id,
        name: serviceName,
        category,
        cost: parsedCost,
        currency,
        billingCycle: billingCycle as 'daily' | 'weekly' | 'monthly' | 'yearly',
        nextBillingDate: parsedNextDate,
        trialEndDate: isTrial ? parsedTrialDate : undefined,
        status: isTrial ? 'trial' : 'active',
        source: pastedText.trim() ? 'email' : 'manual',
        reminderEnabled: true,
        reminderDays: 3,
        iconLibrary: selectedIcon?.library,
        iconName: selectedIcon?.name,
        iconColor: selectedIcon?.color,
        notes: notes || undefined,
      });

      if (Platform.OS === 'web') {
        globalThis.alert('Subscription added!');
        navigation.navigate('Dashboard');
        return;
      }

      Alert.alert('Success', 'Subscription added!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            }),
        }
      ]);
    } catch (error) {
      console.error('Failed to add subscription:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add subscription');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('AppTabs');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pb-24">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={handleBack}
            style={{ marginRight: 12, padding: 4 }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">Add Subscription</Text>
            <Text className="text-sm text-gray-600 mt-1">Paste receipt or enter manually</Text>
          </View>
        </View>

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

        {showPreview && serviceName && (
          <Card className="mb-4 bg-teal-50 border border-teal-200">
            <Text className="font-semibold text-gray-900 mb-2">✓ Detected:</Text>
            <Text className="text-sm text-gray-700">Service: {serviceName}</Text>
            <Text className="text-sm text-gray-700">Amount: {currency} {monthlyCost}</Text>
            {nextBillDate && (
              <Text className="text-sm text-gray-700">Next Bill Date: {nextBillDate}</Text>
            )}
            {isTrial && <Text className="text-sm text-orange-600">Trial detected!</Text>}
          </Card>
        )}

        <Card>
          <Text className="text-sm font-medium text-gray-700 mb-4">
            Enter Details
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

              {/* Icon Selector */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Icon</Text>
                <TouchableOpacity
                  onPress={() => setShowIconPicker(!showIconPicker)}
                  className="flex-row items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {selectedIcon ? (
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
                        {selectedIcon.library === 'MaterialCommunityIcons' ? (
                          <MaterialCommunityIcons name={selectedIcon.name as any} size={24} color={selectedIcon.color} />
                        ) : (
                          <Ionicons name={selectedIcon.name as any} size={24} color={selectedIcon.color} />
                        )}
                      </View>
                      <Text className="text-gray-900">Selected Icon</Text>
                    </View>
                  ) : (
                    <Text className="text-gray-400">Choose an icon</Text>
                  )}
                  <Text className="text-gray-400">{showIconPicker ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* Icon Grid */}
                {showIconPicker && (
                  <View className="flex-row flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-xl">
                    {iconOptions.map((icon, index) => {
                      const IconComponent = icon.library === 'MaterialCommunityIcons' 
                        ? MaterialCommunityIcons 
                        : Ionicons;
                      const isSelected = selectedIcon?.name === icon.name;
                      
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedIcon(icon);
                            setShowIconPicker(false);
                          }}
                          className={`w-14 h-14 rounded-full items-center justify-center ${
                            isSelected ? 'bg-[#4FD1C5]' : 'bg-white'
                          }`}
                          style={{ borderWidth: 1, borderColor: isSelected ? '#4FD1C5' : '#E5E7EB' }}
                        >
                          <IconComponent 
                            name={icon.name as any} 
                            size={28} 
                            color={isSelected ? 'white' : icon.color} 
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

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

              <Button onPress={handleSubmit} loading={isSaving}>
                Save Subscription
              </Button>
            </View>
          </Card>
      </View>
    </ScrollView>
  );
}
