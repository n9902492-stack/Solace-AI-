import { useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Welcome from "./src/screens/Welcome";
import { colors } from "./src/theme/colors";

export default function App() {
  const [screen, setScreen] = useState<"splash" | "onboarding" | "home">("splash");

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.shell}>
        <Welcome screen={screen} onContinue={() => setScreen(screen === "splash" ? "onboarding" : "home")} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.background },
});
