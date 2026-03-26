import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Badge, Card } from '../components/ui';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function SubscriptionDetailScreen({ navigation, route }: any) {
  const { getSubscriptionById, updateSubscription, deleteSubscription, fetchSubscriptions } = useSubscriptionStore();
  const subscription = getSubscriptionById(route.params?.id);

  useEffect(() => {
    if (!subscription) {
      fetchSubscriptions();
    }
  }, [subscription, fetchSubscriptions]);

  if (!subscription) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-4">
        <Text className="text-gray-600">Subscription not found</Text>
        <Button onPress={() => navigation.goBack()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  const currencySymbol = subscription.currency === 'THB' ? '฿' : '$';
  const formattedDate = new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      `Are you sure you want to delete ${subscription.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSubscription(subscription.id);
            Alert.alert('Success', 'Subscription deleted', [{ text: 'OK', onPress: () => navigation.goBack() }]);
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Mark as Cancelled',
      `Mark ${subscription.name} as cancelled?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            await updateSubscription(subscription.id, { status: 'cancelled' });
            Alert.alert('Success', 'Subscription marked as cancelled');
          },
        },
      ]
    );
  };

  // Render icon based on library
  const renderIcon = () => {
    if (!subscription.iconName) return null;
    
    const IconComponent = subscription.iconLibrary === 'MaterialCommunityIcons' 
      ? MaterialCommunityIcons 
      : Ionicons;
    
    return (
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
        <IconComponent 
          name={subscription.iconName as any} 
          size={40} 
          color={subscription.iconColor || '#4FD1C5'} 
        />
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 pb-24">
        {/* Header Card */}
        <Card className="mb-6">
          {/* Icon */}
          {renderIcon()}

          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {subscription.name}
              </Text>
              <View className="flex-row items-center gap-2">
                <Badge variant="default">{subscription.category || 'General'}</Badge>
                {(subscription.status === 'trial' || !!subscription.trialEndDate) && <Badge variant="success">Trial</Badge>}
                <Badge variant={subscription.status === 'active' ? 'success' : 'default'}>
                  {subscription.status}
                </Badge>
              </View>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-4xl font-bold text-[#4FD1C5] mb-1">
              {currencySymbol}{subscription.cost}
            </Text>
            <Text className="text-sm text-gray-600 capitalize">
              per {subscription.billingCycle}
            </Text>
          </View>
        </Card>

        {/* Details Card */}
        <Card className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Details</Text>

          <View className="gap-3">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Next Bill Date</Text>
              <Text className="font-medium text-gray-900">{formattedDate}</Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Billing Cycle</Text>
              <Text className="font-medium text-gray-900 capitalize">
                {subscription.billingCycle}
              </Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Currency</Text>
              <Text className="font-medium text-gray-900">{subscription.currency}</Text>
            </View>

            {subscription.trialEndDate && (
              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600">Trial End Date</Text>
                <Text className="font-medium text-orange-600">
                  {new Date(subscription.trialEndDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            )}

            {subscription.notes && (
              <View className="py-2">
                <Text className="text-gray-600 mb-1">Notes</Text>
                <Text className="text-gray-900">{subscription.notes}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Cost Breakdown Card */}
        <Card className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</Text>

          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Monthly</Text>
              <Text className="font-medium text-gray-900">
                {currencySymbol}{subscription.cost}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Yearly (estimated)</Text>
              <Text className="font-medium text-gray-900">
                {currencySymbol}{(subscription.cost * 12).toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button
              variant="outline"
              onPress={() => navigation.navigate('AddSubscription', { initialTab: 'manual' })}
          >
            Edit Subscription
          </Button>

          {subscription.status === 'active' && (
            <Button variant="secondary" onPress={handleCancel}>
              Mark as Cancelled
            </Button>
          )}

          <Button variant="outline" onPress={handleDelete} className="border-red-500">
            <Text className="text-red-500 font-medium">Delete Subscription</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
