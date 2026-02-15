/**
 * Register Screen
 * Allows users to create a new account
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { RegisterScreenProps } from '@/app/navigation.types';
import { ROUTES } from '@/app/routes';
import { useAuthStore } from '@store/authStore';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { register, error, isLoading } = useAuthStore();

  const handleRegister = async () => {
    await register(email, password, displayName);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="pt-[60px] px-6">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-primary font-medium">← Back</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-8 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
        <Text className="text-base text-gray-500 mb-8">Sign up to start tracking your subscriptions</Text>

        <View className="mt-4">
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Full Name"
            placeholderTextColor="#6B7280"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Email"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Password"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error && <Text className="text-danger text-sm mb-2">{error}</Text>}

          <TouchableOpacity
            className="bg-primary rounded-xl py-4 items-center mt-4"
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-base font-semibold text-white">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center mt-6" onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text className="text-sm text-gray-500">
              Already have an account? <Text className="text-primary font-semibold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
