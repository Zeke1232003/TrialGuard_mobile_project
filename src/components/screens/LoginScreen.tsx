import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button, Input } from '../ui';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, accept any login
      navigation.replace('Main');
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
              Welcome Back
            </Text>

            <View className="space-y-4">
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

              <View className="mt-2" />

              <Button
                onPress={handleLogin}
                loading={isLoading}
                className="w-full py-6"
              >
                Log In
              </Button>
            </View>

            <View className="mt-4 items-center">
              <Text
                onPress={() => navigation.navigate('Register')}
                className="text-sm text-[#4FD1C5] font-medium"
              >
                Don't have an account? Sign up
              </Text>
            </View>

            {/* Demo Credentials */}
            <View className="mt-6 p-3 bg-teal-50 rounded-xl border border-teal-200">
              <Text className="text-xs text-gray-600 mb-1 font-medium">Demo Account:</Text>
              <Text className="text-xs text-gray-700">📧 demo@student.com</Text>
              <Text className="text-xs text-gray-700">🔑 demo123</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
