import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const reminders = {
  checkIn: { title: "Mood check-in", body: "Take a moment to notice how you feel.", page: "Check-in" },
  breathe: { title: "Breathing break", body: "Make time for a quiet pause.", page: "Breathe" },
} as const;

export type Reminder = keyof typeof reminders;

const channelId = "solace-reminders";
const identifier = (kind: Reminder) => "solace-" + kind;

export function reminderDestination(response: Notifications.NotificationResponse | null) {
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
