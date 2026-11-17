import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  screen: "splash" | "onboarding" | "home";
  onContinue: () => void;
};

const slides = [
  { title: "Make room for how you feel.", body: "Take a short check-in to notice your mood and see what changes over time." },
  { title: "Find a small pause.", body: "Try guided breathing and choose a daily habit that fits your day." },
  { title: "Meet Zen Monk.", body: "Zen Monk is Solace’s companion for reflecting on your feelings and finding a small next step." },
];

export default function Welcome({ screen, onContinue }: Props) {
  const [step, setStep] = useState(0);
  const lastStep = step === slides.length - 1;

  function advance() {
    if (screen === "onboarding" && !lastStep) {
      setStep(step + 1);
      return;
    }
    onContinue();
  }

  const content = screen === "onboarding" ? slides[step] : screen === "splash"
    ? { title: "A moment for yourself.", body: "A little space to check in, breathe, and care for yourself." }
    : { title: "How are you feeling today?", body: "You can begin again, as many times as it takes." };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>Solace</Text>
      <View style={styles.content}>
        <View style={styles.shape} accessible={false} />
        <Text accessibilityRole="header" style={styles.title}>{content.title}</Text>
        <Text style={styles.body}>{content.body}</Text>
      </View>
      {screen !== "home" && (
        <View style={styles.actions}>
          {screen === "onboarding" && <Text style={styles.counter}>Step {step + 1} of {slides.length}</Text>}
          <Pressable accessibilityRole="button" style={styles.button} onPress={advance}>
            <Text style={styles.buttonLabel}>
              {screen === "splash" ? "Get started" : lastStep ? "Go to Home" : "Continue"}
            </Text>
          </Pressable>
          {screen === "onboarding" && step > 0 && (
            <Pressable accessibilityRole="button" style={styles.back} onPress={() => setStep(step - 1)}>
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, width: "100%", maxWidth: 480, alignSelf: "center", padding: 24, gap: 24 },
  brand: { color: "#204539", fontSize: 21, fontWeight: "700" },
  content: { flexGrow: 1, justifyContent: "center", gap: 16 },
  shape: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#a6d7c4", borderWidth: 12, borderColor: "#d9e9cf" },
  title: { color: "#20392e", fontSize: 38, fontWeight: "700", letterSpacing: -1 },
  body: { color: "#334c3e", fontSize: 17, lineHeight: 26 },
  actions: { gap: 8 },
  counter: { color: "#334c3e", textAlign: "center" },
  button: { backgroundColor: "#275746", borderRadius: 18, minHeight: 52, alignItems: "center", justifyContent: "center", padding: 12 },
  buttonLabel: { color: "white", fontSize: 16, fontWeight: "700" },
  back: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  backLabel: { color: "#204539", fontSize: 16 },
});
