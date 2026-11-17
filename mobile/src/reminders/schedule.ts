import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { reminders, type Reminder, type ReminderDestination } from "./destinations";

const channelId = "solace-reminders";
const identifier = (kind: Reminder) => "solace-" + kind;

function reminderDestination(response: Notifications.NotificationResponse | null) {
  const id = response?.notification.request.identifier;
  if (id === identifier("checkIn")) return reminders.checkIn.page;
  if (id === identifier("breathe")) return reminders.breathe.page;
}

export async function reminderEnabled(kind: Reminder) {
  return (await Notifications.getAllScheduledNotificationsAsync())
    .some(item => item.identifier === identifier(kind));
}

export async function cancelReminder(kind: Reminder) {
  await Notifications.cancelScheduledNotificationAsync(identifier(kind));
}

export async function scheduleReminder(kind: Reminder, hour: number, minute: number) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(channelId, {
      name: "Solace reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const permission = current.granted ? current : await Notifications.requestPermissionsAsync();
  if (!permission.granted && permission.ios?.status !== Notifications.IosAuthorizationStatus.PROVISIONAL) {
    throw new Error("Allow notifications in your device settings to receive reminders.");
  }

  const { title, body } = reminders[kind];
  await Notifications.scheduleNotificationAsync({
    identifier: identifier(kind),
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      ...(Platform.OS === "android" ? { channelId } : {}),
    },
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function listenForReminders(open: (page: ReminderDestination) => void) {
  function handle(response: Notifications.NotificationResponse | null) {
    const destination = reminderDestination(response);
    if (!destination) return;
    open(destination);
    void Notifications.clearLastNotificationResponseAsync().catch(() => {});
  }

  const subscription = Notifications.addNotificationResponseReceivedListener(handle);
  handle(Notifications.getLastNotificationResponse());
  return () => subscription.remove();
}
