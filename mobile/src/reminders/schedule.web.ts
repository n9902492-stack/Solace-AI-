import { reminders, type Reminder, type ReminderDestination } from "./destinations";

const reminderIds = Object.keys(reminders) as Reminder[];
const key = (kind: Reminder) => "solace.reminder." + kind;

export async function reminderEnabled(kind: Reminder) {
  return localStorage.getItem(key(kind)) !== null;
}

export async function cancelReminder(kind: Reminder) {
  localStorage.removeItem(key(kind));
}

export async function scheduleReminder(kind: Reminder, hour: number, minute: number) {
  if (!("Notification" in window)) throw new Error("This browser does not support notifications.");
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Allow notifications in your browser to receive reminders.");
  localStorage.setItem(key(kind), String(hour * 60 + minute));
}

export function listenForReminders(open: (page: ReminderDestination) => void) {
  const timer = window.setInterval(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const now = new Date();
    const minute = now.getHours() * 60 + now.getMinutes();
    const day = now.toDateString();
    for (const kind of reminderIds) {
      if (localStorage.getItem(key(kind)) !== String(minute)) continue;
      const last = key(kind) + ".last";
      if (localStorage.getItem(last) === day) continue;
      const { title, body, page } = reminders[kind];
      try {
        const notification = new Notification(title, { body });
        notification.onclick = () => { window.focus(); open(page); notification.close(); };
        localStorage.setItem(last, day);
      } catch {
        // Scheduling remains available if the browser cannot show this notification.
      }
    }
  }, 5000);
  return () => window.clearInterval(timer);
}
