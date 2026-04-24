import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { Subscription } from '@models/Subscription';

const NOTIFICATION_CHANNEL_ID = 'subscription-reminders';
const ALARM_CHANNEL_ID = 'subscription-alarms';
const DAILY_SUMMARY_TYPE = 'daily_summary';
const ALARM_CATEGORY_ID = 'trialguard_alarm_category';
const CLOSE_ALARM_ACTION_ID = 'close_alarm_action';
const ALARM_SOUND_FILENAME = 'alarm_10s.wav';

let notificationPermissionGranted: boolean | null = null;
let notificationsModule: typeof import('expo-notifications') | null | undefined;
let notificationHandlerConfigured = false;

export type TestNotificationResult =
  | 'scheduled'
  | 'unsupported_web'
  | 'unsupported_expo_go_android'
  | 'module_unavailable'
  | 'permission_denied';

export type NotificationResponseCleanup = () => void;

function getUnsupportedRuntimeReason(): TestNotificationResult | null {
  if (Platform.OS === 'web') {
    return 'unsupported_web';
  }

  if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
    return 'unsupported_expo_go_android';
  }

  return null;
}

async function getNotificationsModuleAsync(): Promise<typeof import('expo-notifications') | null> {
  if (getUnsupportedRuntimeReason()) {
    return null;
  }

  if (notificationsModule !== undefined) {
    return notificationsModule;
  }

  try {
    notificationsModule = await import('expo-notifications');
    return notificationsModule;
  } catch (error) {
    console.warn('expo-notifications is unavailable in this runtime', error);
    notificationsModule = null;
    return null;
  }
}

async function ensureNotificationHandlerConfiguredAsync(): Promise<void> {
  if (notificationHandlerConfigured) {
    return;
  }

  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  notificationHandlerConfigured = true;
}

function getReminderTargetDate(subscription: Subscription): Date {
  return subscription.trialEndDate ? new Date(subscription.trialEndDate) : new Date(subscription.nextBillingDate);
}

function countExpiringWithinDays(subscriptions: Subscription[], days: number): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return subscriptions.filter((subscription) => {
    if (subscription.status === 'cancelled' || subscription.status === 'expired') {
      return false;
    }
    if (!subscription.reminderEnabled) {
      return false;
    }

    const target = getReminderTargetDate(subscription);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays === days;
  }).length;
}

function buildDailySummaryContent(subscriptions: Subscription[]): { title: string; body: string } {
  const expiringTodayCount = countExpiringWithinDays(subscriptions, 0);
  const expiringTomorrowCount = countExpiringWithinDays(subscriptions, 1);

  if (expiringTodayCount === 0 && expiringTomorrowCount === 0) {
    return {
      title: 'TrialGuard daily summary',
      body: 'No subscriptions are expiring today or tomorrow.',
    };
  }

  if (expiringTodayCount > 0 && expiringTomorrowCount > 0) {
    return {
      title: 'TrialGuard daily summary',
      body: `${expiringTodayCount} expiring today, ${expiringTomorrowCount} expiring tomorrow.`,
    };
  }

  if (expiringTodayCount > 0) {
    return {
      title: 'TrialGuard daily summary',
      body: `${expiringTodayCount} subscription${expiringTodayCount > 1 ? 's are' : ' is'} expiring today.`,
    };
  }

  return {
    title: 'TrialGuard daily summary',
    body: `${expiringTomorrowCount} subscription${expiringTomorrowCount > 1 ? 's are' : ' is'} expiring tomorrow.`,
  };
}

async function ensureNotificationPermissionsAsync(): Promise<boolean> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    notificationPermissionGranted = false;
    return false;
  }

  if (notificationPermissionGranted !== null) {
    return notificationPermissionGranted;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    notificationPermissionGranted = true;
    return true;
  }

  if (!current.canAskAgain) {
    notificationPermissionGranted = false;
    return false;
  }

  const requested = await Notifications.requestPermissionsAsync();
  notificationPermissionGranted = requested.granted;
  return requested.granted;
}

export async function initializeNotificationsAsync(): Promise<void> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return;
  }

  await ensureNotificationHandlerConfiguredAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Subscription reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
    });

    await Notifications.setNotificationChannelAsync(ALARM_CHANNEL_ID, {
      name: 'Subscription alarms',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#FF3B30',
      sound: ALARM_SOUND_FILENAME,
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  await Notifications.setNotificationCategoryAsync(ALARM_CATEGORY_ID, [
    {
      identifier: CLOSE_ALARM_ACTION_ID,
      buttonTitle: 'Close Alarm',
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await ensureNotificationPermissionsAsync();
}

export async function registerAlarmCloseActionHandlerAsync(
  onCloseAlarm: () => void
): Promise<NotificationResponseCleanup | undefined> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return undefined;
  }

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    if (response.actionIdentifier === CLOSE_ALARM_ACTION_ID) {
      onCloseAlarm();
    }
  });

  return () => {
    subscription.remove();
  };
}

export async function cancelDailySummaryNotificationAsync(): Promise<void> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return;
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matching = scheduled.filter((item) => item.content.data?.notificationType === DAILY_SUMMARY_TYPE);

  await Promise.all(
    matching.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}

type DailySummaryOptions = {
  enabled: boolean;
  hour: number;
  minute: number;
  alarmModeEnabled: boolean;
};

export async function scheduleDailySummaryNotificationAsync(
  subscriptions: Subscription[],
  options: DailySummaryOptions
): Promise<void> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return;
  }

  await ensureNotificationHandlerConfiguredAsync();
  await cancelDailySummaryNotificationAsync();

  if (!options.enabled) {
    return;
  }

  const hasPermission = await ensureNotificationPermissionsAsync();
  if (!hasPermission) {
    return;
  }

  const content = buildDailySummaryContent(subscriptions);
  const channelId = options.alarmModeEnabled ? ALARM_CHANNEL_ID : NOTIFICATION_CHANNEL_ID;
  const summaryTitle = options.alarmModeEnabled ? 'TrialGuard alarm summary' : content.title;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: summaryTitle,
      body: content.body,
      sound: options.alarmModeEnabled ? ALARM_SOUND_FILENAME : true,
      categoryIdentifier: options.alarmModeEnabled ? ALARM_CATEGORY_ID : undefined,
      priority: options.alarmModeEnabled
        ? Notifications.AndroidNotificationPriority.MAX
        : Notifications.AndroidNotificationPriority.HIGH,
      data: {
        notificationType: DAILY_SUMMARY_TYPE,
        deliveryMode: options.alarmModeEnabled ? 'alarm' : 'notification',
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: options.hour,
      minute: options.minute,
      channelId: Platform.OS === 'android' ? channelId : undefined,
    },
  });
}

export async function syncDailySummaryNotificationAsync(
  subscriptions: Subscription[],
  options: DailySummaryOptions
): Promise<void> {
  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return;
  }

  await scheduleDailySummaryNotificationAsync(subscriptions, options);
}

export async function scheduleTestNotificationAsync(
  secondsFromNow: number = 10,
  alarmModeEnabled: boolean = false
): Promise<TestNotificationResult> {
  const unsupportedReason = getUnsupportedRuntimeReason();
  if (unsupportedReason) {
    return unsupportedReason;
  }

  const Notifications = await getNotificationsModuleAsync();
  if (!Notifications) {
    return 'module_unavailable';
  }

  await ensureNotificationHandlerConfiguredAsync();
  const hasPermission = await ensureNotificationPermissionsAsync();
  if (!hasPermission) {
    return 'permission_denied';
  }

  const delaySeconds = Math.max(1, Math.trunc(secondsFromNow));
  const triggerDate = new Date(Date.now() + delaySeconds * 1000);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: alarmModeEnabled ? 'TrialGuard test alarm' : 'TrialGuard test notification',
      body: alarmModeEnabled
        ? `This is a test alarm (${delaySeconds}s delay).`
        : `This is a test notification (${delaySeconds}s delay).`,
      sound: alarmModeEnabled ? ALARM_SOUND_FILENAME : true,
      categoryIdentifier: alarmModeEnabled ? ALARM_CATEGORY_ID : undefined,
      priority: alarmModeEnabled
        ? Notifications.AndroidNotificationPriority.MAX
        : Notifications.AndroidNotificationPriority.HIGH,
      data: {
        notificationType: 'test_notification',
        deliveryMode: alarmModeEnabled ? 'alarm' : 'notification',
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === 'android'
        ? (alarmModeEnabled ? ALARM_CHANNEL_ID : NOTIFICATION_CHANNEL_ID)
        : undefined,
    },
  });

  return 'scheduled';
}
