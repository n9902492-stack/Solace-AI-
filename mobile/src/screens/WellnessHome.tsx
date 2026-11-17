import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Page = "Home" | "Check-in" | "Breathe" | "Resources" | "Zen Monk";

const activities = [
  ["Check-in", "Notice how you feel today"],
  ["Breathe", "Take a quiet, guided pause"],
  ["Resources", "Explore small self-care activities"],
  ["Zen Monk", "Try a guided reflection"],
] as const;

const guides = [
  ["Grounding", "Notice five things you can see, four you can feel, and three you can hear."],
  ["Wind down", "Dim the lights and take a few minutes away from your screen."],
] as const;

const prompts = [
  "What feeling would you like to make space for?",
  "What is one small thing that would make today easier?",
  "What would you say to a friend in your situation?",
];

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function Breathing() {
  const [started, setStarted] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (started === null) return;
    const timer = setInterval(() => {
      const elapsed = Math.min(56, Math.floor((Date.now() - started) / 1000));
      setSeconds(elapsed);
      if (elapsed === 56) setStarted(null);
    }, 200);
    return () => clearInterval(timer);
  }, [started]);

  const position = seconds % 14;
  const phase = position < 4 ? "Breathe in" : position < 8 ? "Hold gently" : "Breathe out";
  return (
    <View style={styles.card}>
      <Text style={styles.body}>4 seconds in · 4 hold · 6 out</Text>
      <Text accessibilityLiveRegion="polite" style={styles.cardTitle}>
        {started !== null ? phase : seconds === 56 ? "Session complete" : "Ready when you are"}
      </Text>
      {started !== null && <Text style={styles.body}>Cycle {Math.floor(seconds / 14) + 1} of 4</Text>}
      <Action label={started === null ? "Start breathing" : "Stop"} onPress={() => {
        setSeconds(0);
        setStarted(started === null ? Date.now() : null);
      }} />
    </View>
  );
}

export default function WellnessHome({ name }: { name: string }) {
  const [page, setPage] = useState<Page>("Home");
  const [mood, setMood] = useState("");
  const [guide, setGuide] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(0);

  return (
    <View style={styles.shell}>
      <ScrollView key={page} contentContainerStyle={styles.content}>
        <Text style={styles.brand}>Solace</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {page === "Home" ? `Welcome, ${name}.` : page}
        </Text>
        {page === "Home" && <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today’s affirmation</Text>
            <Text style={styles.body}>You can begin again, as many times as it takes.</Text>
            {mood ? <Text style={styles.body}>This session’s mood: {mood}</Text> : null}
          </View>
          {activities.map(([label, detail]) => (
            <Pressable key={label} accessibilityRole="button" style={styles.card} onPress={() => setPage(label)}>
              <Text style={styles.cardTitle}>{label}</Text>
              <Text style={styles.body}>{detail}</Text>
            </Pressable>
          ))}
        </>}
        {page === "Check-in" && <>
          <Text style={styles.body}>How are you feeling right now?</Text>
          {["Low", "Uneasy", "Okay", "Good", "Great"].map(option => (
            <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: mood === option }}
              style={[styles.card, mood === option && styles.selected]} onPress={() => setMood(option)}>
              <Text style={styles.cardTitle}>{option}</Text>
            </Pressable>
          ))}
          {mood ? <Text accessibilityLiveRegion="polite" style={styles.body}>Mood noted for this session: {mood}</Text> : null}
        </>}
        {page === "Breathe" && <Breathing />}
        {page === "Resources" && guides.map(([label, detail]) => (
          <Pressable key={label} accessibilityRole="button" accessibilityState={{ expanded: guide === label }}
            style={styles.card} onPress={() => setGuide(guide === label ? null : label)}>
            <Text style={styles.cardTitle}>{label}</Text>
            {guide === label && <Text style={styles.body}>{detail}</Text>}
          </Pressable>
        ))}
        {page === "Zen Monk" && <View style={styles.card}>
          <Text style={styles.cardTitle}>Guided reflection</Text>
          <Text accessibilityLiveRegion="polite" style={styles.body}>{prompts[prompt]}</Text>
          <Action label="Another prompt" onPress={() => setPrompt((prompt + 1) % prompts.length)} />
        </View>}
      </ScrollView>
      <View style={styles.nav}>
        {(["Home", "Check-in", "Breathe", "Resources", "Zen Monk"] as const).map(tab => (
          <Pressable key={tab} accessibilityRole="tab" accessibilityState={{ selected: page === tab }}
            style={[styles.tab, page === tab && styles.selected]} onPress={() => setPage(tab)}>
            <Text style={styles.tabText}>{tab}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: { width: "100%", maxWidth: 480, alignSelf: "center", padding: 24, gap: 12 },
  brand: { color: colors.accent, fontSize: 19, fontWeight: "700" },
  title: { color: colors.text, fontFamily: "serif", fontSize: 34, fontWeight: "700" },
  card: { padding: 16, borderRadius: 16, backgroundColor: colors.softIvory, gap: 8 },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  body: { color: colors.mutedText, fontSize: 16, lineHeight: 24 },
  button: { minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 14, backgroundColor: colors.button },
  buttonText: { color: colors.buttonText, fontWeight: "700" },
  nav: { width: "100%", maxWidth: 480, alignSelf: "center", flexDirection: "row", paddingHorizontal: 8, gap: 4 },
  tab: { flex: 1, minHeight: 48, paddingVertical: 6, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tabText: { color: colors.accent, fontSize: 12, fontWeight: "600", textAlign: "center" },
  selected: { backgroundColor: "#D7DFC9" },
});
