import * as Notifications from 'expo-notifications';
import { t } from './i18n';

/** Request permissions + schedule daily notification at 20:00. Returns false if permission denied. */
export async function scheduleDailyReminder(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    // Cancel any existing before re-scheduling
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notif.title') as string,
        body: t('notif.body') as string,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
    return true;
  } catch (err) {
    console.warn('[Notifications] Failed to schedule:', err);
    return false;
  }
}

/** Cancel all scheduled notifications */
export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
