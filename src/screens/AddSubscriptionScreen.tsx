import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert, Switch, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Input, Card } from '../components/ui';

export function AddSubscriptionScreen({ navigation }: any) {
  const [pastedText, setPastedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

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

  const handleParse = () => {
    if (!pastedText.trim()) {
      Alert.alert('Error', 'Please paste some text to parse');
      return;
    }

    // Simple parsing logic (mock)
    const text = pastedText.toLowerCase();
    
    // Try to extract service name and set icon
    if (text.includes('netflix')) {
      setServiceName('Netflix');
      setSelectedIcon(iconOptions[0]);
    } else if (text.includes('spotify')) {
      setServiceName('Spotify');
      setSelectedIcon(iconOptions[1]);
    } else if (text.includes('disney')) {
      setServiceName('Disney+');
      setSelectedIcon(iconOptions[2]);
    } else if (text.includes('youtube')) {
      setServiceName('YouTube Premium');
      setSelectedIcon(iconOptions[3]);
    } else if (text.includes('amazon')) {
      setServiceName('Amazon Prime');
    } else {
      setServiceName('Unknown Service');
    }

    // Try to extract amount
    const amountMatch = text.match(/\d+/);
    if (amountMatch) {
      setMonthlyCost(amountMatch[0]);
    }

    // Try to extract date (e.g., "3 jun", "june 3", "3 june 2026")
    const datePatterns = [
      /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{1,2})/i,
      /(\d{4})-(\d{2})-(\d{2})/,
    ];

    const monthMap: { [key: string]: string } = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[0].includes('-')) {
          // Already in YYYY-MM-DD format
          setNextBillDate(match[0]);
        } else {
          // Convert "3 jun" or "jun 3" to date
          const day = match[1].match(/\d+/) ? match[1] : match[2];
          const monthText = match[1].match(/[a-z]+/i) ? match[1] : match[2];
          const month = monthMap[monthText.substring(0, 3).toLowerCase()];
          const year = '2026'; // default to current year
          const formattedDay = day.padStart(2, '0');
          setNextBillDate(`${year}-${month}-${formattedDay}`);
        }
        break;
      }
    }

    // Detect keywords for trial or expiry
    if (text.includes('trial') || text.includes('free')) {
      setIsTrial(true);
    }
    if (text.includes('expire') || text.includes('expiry') || text.includes('end')) {
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

              <Button onPress={handleSubmit}>
                Save Subscription
              </Button>
            </View>
          </Card>
      </View>
    </ScrollView>
  );
}
