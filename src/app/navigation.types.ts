/**
 * Navigation type definitions
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from './routes';

/**
 * Root Stack Navigator param list
 */
export type RootStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.HOME]: undefined;
  [ROUTES.ADD_SUBSCRIPTION]: undefined;
  [ROUTES.SUBSCRIPTION_DETAIL]: {
    subscriptionId: string;
  };
  [ROUTES.CALENDAR]: undefined;
  [ROUTES.SETTINGS]: undefined;
};

/**
 * Screen props helper type
 */
export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Navigation prop types for each screen
export type LoginScreenProps = ScreenProps<typeof ROUTES.LOGIN>;
export type RegisterScreenProps = ScreenProps<typeof ROUTES.REGISTER>;
export type HomeScreenProps = ScreenProps<typeof ROUTES.HOME>;
export type AddSubscriptionScreenProps = ScreenProps<typeof ROUTES.ADD_SUBSCRIPTION>;
export type SubscriptionDetailScreenProps = ScreenProps<typeof ROUTES.SUBSCRIPTION_DETAIL>;
export type CalendarScreenProps = ScreenProps<typeof ROUTES.CALENDAR>;
export type SettingsScreenProps = ScreenProps<typeof ROUTES.SETTINGS>;
