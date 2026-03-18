import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function LandingScreen({ navigation }: any) {
  const features = [
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Never Miss a Trial',
      description: 'Get alerts before your free trials convert to paid subscriptions.',
      iconBg: '#DFF7F2',
      iconColor: '#30BFAF',
    },
    {
      icon: 'calendar-outline' as const,
      title: 'Smart Calendar',
      description: 'See all your upcoming bills in one clean calendar view.',
      iconBg: '#E8ECFF',
      iconColor: '#6366F1',
    },
    {
      icon: 'wallet-outline' as const,
      title: 'Spending Insights',
      description: 'Track your monthly subscription spend and find what to cut.',
      iconBg: '#FFF4DD',
      iconColor: '#F59E0B',
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Receipt Parser',
      description: 'Paste any email receipt and we extract the details automatically.',
      iconBg: '#DFF7F2',
      iconColor: '#30BFAF',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Add a subscription',
      description: 'Paste a receipt or enter manually in seconds.',
    },
    {
      number: '02',
      title: 'Get smart alerts',
      description: 'We remind you 7, 3, and 1 day before any charge.',
    },
    {
      number: '03',
      title: 'Stay in control',
      description: 'Cancel or keep — you decide, not your wallet.',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-[#EAF7F5]"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="px-6 pt-10 pb-12 items-center">
        <View className="bg-[#FFF4DD] border border-[#F7D37D] rounded-full px-4 py-2 mb-8">
          <Text className="text-[#A16207] text-base font-medium">★ Free to use · No credit card</Text>
        </View>

        <View className="w-44 h-44 rounded-full border-4 border-[#56CDC1] items-center justify-center mb-7">
          <View className="w-32 h-32 bg-[#56CDC1] rounded-3xl items-center justify-center">
            <Text className="text-white text-5xl">🛡️</Text>
          </View>
        </View>

        <Text className="text-6xl font-bold text-[#0F172A] mb-4">TrialGuard</Text>
        <Text className="text-center text-[#4B5563] text-4xl leading-8 mb-10">
          Take control of your subscriptions.{"\n"}
          Never pay for trials you forgot.
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('AuthStack', { screen: 'Register' })}
            className="bg-[#4FD1C5] py-5 rounded-3xl items-center"
            style={{ elevation: 4, shadowColor: '#4FD1C5', shadowOpacity: 0.35, shadowRadius: 10 }}
          >
            <Text className="text-white text-2xl font-bold">Get Started — It's Free →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}
            className="border-2 border-[#56CDC1] py-5 rounded-3xl items-center"
          >
            <Text className="text-[#30BFAF] text-2xl font-bold">Log In</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[#9CA3AF] tracking-[2px] mt-12 text-sm">SCROLL TO EXPLORE</Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" style={{ marginTop: 6 }} />
      </View>

      <View className="bg-[#4FD1C5] py-6 px-6">
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-white text-4xl font-bold">10k+</Text>
            <Text className="text-[#C4F3EC] text-sm mt-1">USERS</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-white text-4xl font-bold">฿0</Text>
            <Text className="text-[#C4F3EC] text-sm mt-1">COST</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-white text-4xl font-bold">99%</Text>
            <Text className="text-[#C4F3EC] text-sm mt-1">UPTIME</Text>
          </View>
        </View>
      </View>

      <View className="px-6 py-10">
        <Text className="text-[#30BFAF] tracking-[3px] text-sm font-semibold mb-3">FEATURES</Text>
        <Text className="text-[#0F172A] text-5xl font-bold mb-3">Everything you need</Text>
        <Text className="text-[#4B5563] text-3xl leading-8 mb-8">
          Stay on top of every subscription with smart alerts and tracking.
        </Text>

        <View className="gap-4">
          {features.map((feature) => (
            <View
              key={feature.title}
              className="bg-white rounded-3xl p-5 flex-row items-center"
              style={{ elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 }}
            >
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                style={{ backgroundColor: feature.iconBg }}
              >
                <Ionicons name={feature.icon} size={30} color={feature.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-[#111827] text-3xl font-bold mb-1">{feature.title}</Text>
                <Text className="text-[#4B5563] text-2xl leading-7">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-white px-6 py-10">
        <Text className="text-[#30BFAF] tracking-[3px] text-sm font-semibold mb-3">HOW IT WORKS</Text>
        <Text className="text-[#0F172A] text-5xl font-bold mb-8">Three simple steps</Text>

        <View className="gap-6">
          {steps.map((step) => (
            <View key={step.number} className="flex-row items-start">
              <View className="w-14 h-14 rounded-2xl bg-[#DFF7F2] items-center justify-center mr-4">
                <Text className="text-[#1F9F93] text-xl font-bold">{step.number}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#111827] text-3xl font-bold mb-1">{step.title}</Text>
                <Text className="text-[#4B5563] text-2xl leading-7">{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-[#0F1A3A] px-6 py-12 items-center">
        <Text className="text-white text-5xl font-bold mb-4 text-center">Ready to save money?</Text>
        <Text className="text-[#9CA3AF] text-3xl leading-8 text-center mb-8">
          Join thousands of students keeping their subscriptions in check.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('AuthStack', { screen: 'Register' })}
          className="w-full bg-[#4FD1C5] py-5 rounded-3xl items-center"
          style={{ elevation: 4, shadowColor: '#4FD1C5', shadowOpacity: 0.35, shadowRadius: 10 }}
        >
          <Text className="text-white text-2xl font-bold">Create Free Account →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })} className="mt-6">
          <Text className="text-[#9CA3AF] text-xl">
            Already have an account? <Text className="text-[#4FD1C5] font-semibold">Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
