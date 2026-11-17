import { useEffect, useState } from "react";
import { Button, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";
import { cancelReminder, reminderEnabled, scheduleReminder } from "./schedule";
import { reminders, type Reminder } from "./destinations";

function ReminderCard({ kind }: { kind: Reminder }) {
  const [time, setTime] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    reminderEnabled(kind).then(setEnabled).catch(() => {
      setFeedback("Could not read the current reminder.");
    });
  }, [kind]);

  async function update(cancel: boolean) {
    if (busy) return;
    setBusy(true);
    setFeedback("");
    try {
      if (cancel) {
        await cancelReminder(kind);
        setEnabled(false);
        setFeedback("Reminder turned off.");
      } else {
        const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
        if (!match) {
          setFeedback("Enter a time in 24-hour format, such as 08:30.");
          return;
        }
        await scheduleReminder(kind, Number(match[1]), Number(match[2]));
        setEnabled(true);
        setFeedback("Daily reminder scheduled for " + time.trim() + ".");
      }
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not update the reminder.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{reminders[kind].title}</Text>
      <Text style={styles.text}>{enabled ? "Daily reminder on" : "Daily reminder off"}</Text>
      <TextInput accessibilityLabel={reminders[kind].title + " time"} placeholder="HH:MM"
        placeholderTextColor={colors.mutedText} value={time} onChangeText={setTime}
        autoCorrect={false} maxLength={5} style={styles.input} />
      <Button color={colors.button} disabled={busy} title={enabled ? "Change time" : "Schedule reminder"}
        onPress={() => void update(false)} />
      {enabled && <Button color={colors.accent} disabled={busy} title="Turn off" onPress={() => void update(true)} />}
      {feedback ? <Text accessibilityLiveRegion="polite" style={styles.text}>{feedback}</Text> : null}
    </View>
  );
}

export default function RemindersScreen() {
  return (
    <View style={styles.stack}>
      <Text style={styles.text}>Reminders use this device’s local time.</Text>
      {Platform.OS === "web" && <Text style={styles.text}>Keep this tab open to receive browser reminders.</Text>}
      <ReminderCard kind="checkIn" />
      <ReminderCard kind="breathe" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {gap: 12},
  card: {gap: 8, padding: 16, borderRadius: 14, backgroundColor: colors.softIvory},
  title: {fontSize: 18, fontWeight: "700", color: colors.text},
  text: {fontSize: 16, color: colors.text},
  input: {minHeight: 48, borderWidth: 1, borderRadius: 12, borderColor: colors.mutedText, padding: 12, color: colors.text},
});
