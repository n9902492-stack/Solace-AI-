import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import PhotoBanner from "../components/PhotoBanner";
import { colors } from "../theme/colors";

type Props = {
  onSubmit: (mode: "signup" | "login", values: { name: string; email: string; password: string }) => Promise<void>;
};

export default function AuthScreen({ onSubmit }: Props) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try { await onSubmit(mode, { name, email, password }); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Solace</Text>
      <PhotoBanner scene="plant" />
      <Text accessibilityRole="header" style={styles.title}>{signup ? "Create your account" : "Welcome back"}</Text>
      {signup && <TextInput style={styles.input} placeholder="Name" placeholderTextColor={colors.mutedText} accessibilityLabel="Name" autoComplete="name" value={name} onChangeText={setName} maxLength={80} />}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.mutedText} accessibilityLabel="Email" autoComplete="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} maxLength={254} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.mutedText} accessibilityLabel="Password" secureTextEntry autoComplete={signup ? "new-password" : "current-password"} value={password} onChangeText={setPassword} maxLength={128} />
      {signup && <Text style={styles.brand}>Use at least 8 characters.</Text>}
      {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={submit} style={[styles.button, busy && { opacity: 0.6 }]}>
        <Text style={styles.buttonText}>{busy ? "Please wait…" : signup ? "Sign up" : "Log in"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => { setMode(signup ? "login" : "signup"); setError(""); setPassword(""); }} style={styles.link}>
        <Text style={styles.brand}>{signup ? "Already have an account? Log in" : "New to Solace? Sign up"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 480, alignSelf: "center", padding: 24, gap: 14 },
  brand: { color: colors.accent, fontSize: 16 },
  title: { color: colors.text, fontFamily: Platform.select({ ios: "Georgia", android: "serif" }), fontSize: 32, fontWeight: "700", marginBottom: 8 },
  input: { minHeight: 52, padding: 12, color: colors.text, backgroundColor: "#FFFDF7", borderColor: "#B8BEAD", borderWidth: 1, borderRadius: 14 },
  button: { minHeight: 52, justifyContent: "center", alignItems: "center", backgroundColor: colors.button, borderRadius: 18 },
  buttonText: { color: colors.buttonText, fontWeight: "700", fontSize: 16 },
  link: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  error: { color: "#913623" },
});
