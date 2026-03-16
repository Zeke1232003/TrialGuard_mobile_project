import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button, Input } from '../ui';

export function RegisterScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.replace('MainTabs') }
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-gradient-to-br from-teal-50 to-cyan-100"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
      >
        <View className="w-full max-w-sm mx-auto">
          {/* App Logo */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-[#4FD1C5] rounded-2xl items-center justify-center mb-4 shadow-lg">
              <Text className="text-white text-3xl">🛡️</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900">TrialGuard</Text>
            <Text className="text-gray-600 mt-2 text-sm">Never forget subscriptions</Text>
          </View>

          {/* Auth Form */}
          <View className="bg-white rounded-3xl p-6 shadow-xl">
            <Text className="text-xl font-bold text-gray-900 mb-6 text-center">
              Create Account
            </Text>

            <View className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <Input
                label="Email"
                placeholder="student@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <View className="mt-2" />

              <Button
                onPress={handleRegister}
                loading={isLoading}
                className="w-full py-6"
              >
                Sign Up
              </Button>
            </View>

            <View className="mt-4 items-center">
              <Text
                onPress={() => navigation.navigate('Login')}
                className="text-sm text-[#4FD1C5] font-medium"
              >
                Already have an account? Log in
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
