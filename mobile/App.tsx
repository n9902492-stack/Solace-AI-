import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "./src/auth/session";
import Welcome from "./src/screens/Welcome";
import WellnessHome, { type Page } from "./src/screens/WellnessHome";
import { listenForReminders } from "./src/reminders/schedule";
import AuthScreen from "./src/auth/AuthScreen";
import { ApiError, authRequest } from "./src/auth/api";
import { colors } from "./src/theme/colors";

const sessionKey = "solace.session";

export default function App() {
  const [screen, setScreen] = useState<"loading" | "splash" | "onboarding" | "auth" | "home">("loading");
  const [page, setPage] = useState<Page>("Home");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function restore() {
    setScreen("loading");
    setSessionError("");
    try {
      const token = await SecureStore.getItemAsync(sessionKey);
      if (!token) return setScreen("splash");
      const profile = await authRequest<{ name: string }>("/auth/me", undefined, token);
      setToken(token);
      setName(profile.name);
      setScreen("home");
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) {
        try {
          await SecureStore.deleteItemAsync(sessionKey);
          setScreen("auth");
          return;
        } catch {
          setSessionError("Could not clear the expired session. Please retry.");
          return;
        }
      }
      setSessionError("Could not restore your session. Check your connection and retry.");
    }
  }

  useEffect(() => { void restore(); }, []);

  useEffect(() => screen === "home" ? listenForReminders(setPage) : undefined, [screen]);

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setSessionError("");
    try {
      const token = await SecureStore.getItemAsync(sessionKey);
      if (token) await authRequest("/auth/logout", {}, token);
      await SecureStore.deleteItemAsync(sessionKey);
      setToken("");
      setName("");
      setPage("Home");
      setScreen("auth");
    } catch {
      setSessionError("Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.shell}>
        {screen === "loading" && !sessionError && <ActivityIndicator color={colors.accent} />}
        {sessionError ? <Text accessibilityRole="alert" style={styles.action}>{sessionError}</Text> : null}
        {screen === "loading" && sessionError ? (
          <Pressable accessibilityRole="button" onPress={restore}><Text style={styles.action}>Retry</Text></Pressable>
        ) : null}
        {(screen === "splash" || screen === "onboarding") && (
          <Welcome screen={screen} onContinue={() => setScreen(screen === "splash" ? "onboarding" : "auth")} />
        )}
        {screen === "auth" && (
          <AuthScreen onSubmit={async (mode, values) => {
            const session = await authRequest<{ name: string; token: string }>("/auth/" + mode, values);
            await SecureStore.setItemAsync(sessionKey, session.token);
            setToken(session.token);
            setName(session.name);
            setScreen("home");
          }} />
        )}
        {screen === "home" && <>
          <WellnessHome name={name} token={token} page={page} setPage={setPage} />
          <Pressable accessibilityRole="button" disabled={loggingOut} onPress={logout}>
            <Text style={styles.action}>{loggingOut ? "Logging out…" : "Log out"}</Text>
          </Pressable>
        </>}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.background },
  action: { padding: 16, color: colors.accent, textAlign: "center", fontWeight: "600" },
});
