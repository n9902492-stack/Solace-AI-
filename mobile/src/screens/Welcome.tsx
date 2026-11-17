import { useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  screen: "splash" | "onboarding" | "home";
  onContinue: () => void;
  name?: string;
};

const slides = [
  { title: "Make room for how you feel.", body: "Take a short check-in to notice your mood and see what changes over time." },
  { title: "Find a small pause.", body: "Try guided breathing and choose a daily habit that fits your day." },
  { title: "Meet Zen Monk.", body: "Zen Monk is Solace’s companion for reflecting on your feelings and finding a small next step." },
];

export default function Welcome({ screen, onContinue, name }: Props) {
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
    ? { title: "", body: "A little space to check in, breathe, and care for yourself." }
    : { title: name ? `Welcome, ${name}.` : "How are you feeling today?", body: "You can begin again, as many times as it takes." };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>Solace</Text>
      <View style={styles.content}>
        {screen === "splash" && (
          <View style={styles.hero} accessible={false}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1572242596859-ddcf5aa0594a?auto=format&fit=crop&w=850&q=80" }}
              style={styles.heroImage}
              resizeMode="cover"
              accessible={false}
            />
          </View>
        )}
        <Text accessibilityRole="header" style={styles.title}>
          {screen === "splash" ? (
            <>A moment{"\n"}<Text style={styles.titleAccent}>for yourself.</Text></>
          ) : content.title}
        </Text>
        <Text style={styles.body}>{content.body}</Text>
      </View>
      {screen !== "home" && (
        <View style={styles.actions}>
          {screen === "onboarding" && <Text style={styles.counter}>Step {step + 1} of {slides.length}</Text>}
          <Pressable accessibilityRole="button" style={styles.button} onPress={advance}>
            <Text style={styles.buttonLabel}>
              {screen === "splash" ? "Get started" : lastStep ? "Continue to account" : "Continue"}
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
  brand: { color: colors.accent, fontSize: 21, fontWeight: "700" },
  content: { flexGrow: 1, justifyContent: "center", gap: 16 },
  hero: { width: "100%", aspectRatio: 1.65, borderRadius: 24, overflow: "hidden", backgroundColor: colors.softIvory },
  heroImage: { width: "100%", height: "100%" },
  title: { color: colors.text, fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }), fontSize: 38, fontWeight: "700", letterSpacing: -0.8 },
  titleAccent: { color: colors.accent },
  body: { color: colors.mutedText, fontSize: 17, lineHeight: 26 },
  actions: { gap: 8 },
  counter: { color: colors.mutedText, textAlign: "center" },
  button: { backgroundColor: colors.button, borderRadius: 18, minHeight: 52, alignItems: "center", justifyContent: "center", padding: 12 },
  buttonLabel: { color: colors.buttonText, fontSize: 16, fontWeight: "700" },
  back: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  backLabel: { color: colors.accent, fontSize: 16 },
});
