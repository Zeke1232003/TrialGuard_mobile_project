/**
 * Login Screen
 * Allows users to login with email/password or Google
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LoginScreenProps } from '@/app/navigation.types';
import { ROUTES } from '@/app/routes';
import { useAuthStore } from '@store/authStore';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="pt-[60px] px-6 flex-row items-center">
        <View className="w-10 h-10 bg-primary rounded-xl justify-center items-center mr-2">
          <Text className="text-xl">🔒</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900">TrialGuard</Text>
      </View>

      <View className="flex-1 px-8 pt-12">
        <Text className="text-3xl font-bold text-gray-900 mb-8">Welcome Back</Text>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-4 mb-6"
          onPress={handleGoogleSignIn}
        >
          <Text className="text-xl mr-2">G</Text>
          <Text className="text-base font-medium text-gray-900">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="px-4 text-sm text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-900 mb-1">Email</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl py-4 px-4 text-base text-gray-900"
            placeholder="Enter your email"
            placeholderTextColor="#6B7280"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-900 mb-1">Password</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl py-4 px-4 text-base text-gray-900"
            placeholder="Enter your password"
            placeholderTextColor="#6B7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity className="items-end mb-6">
          <Text className="text-sm text-primary font-medium">Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mb-4"
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        {error && <Text className="text-danger text-sm mt-4 text-center">{error}</Text>}

        <View className="flex-row justify-center items-center my-6">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}>
            <Text className="text-sm text-primary font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="items-center">
          <Text className="text-xs text-gray-500">Terms of Service and Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
