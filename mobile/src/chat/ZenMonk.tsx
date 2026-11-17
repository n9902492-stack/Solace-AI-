import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { authRequest } from "../auth/api";
import { colors } from "../theme/colors";

type Chat = { id: number; title: string };
type Message = { id: number; role: "user" | "guide" | "ai"; text: string };

export default function ZenMonk({ token }: { token: string }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chat, setChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try { await action(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Please try again."); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    let active = true;
    authRequest<Chat[]>("/chats", undefined, token)
      .then(result => { if (active) setChats(result); })
      .catch(() => { if (active) setError("Could not load your conversations."); });
    return () => { active = false; };
  }, [token]);

  function open(item: Chat) {
    return run(async () => {
      const saved = await authRequest<Message[]>("/chats/" + item.id, undefined, token);
      setMessages(saved);
      setText("");
      setChat(item.id);
    });
  }

  function remove(item: Chat) {
    Alert.alert("Delete conversation?", "The saved messages will be removed.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void run(async () => {
        await authRequest("/chats/" + item.id, undefined, token, "DELETE");
        setChats(previous => previous.filter(entry => entry.id !== item.id));
      }) },
    ]);
  }

  return (
    <View style={styles.stack}>
      <Text style={styles.text}>A space to write and reflect.</Text>
      {error ? <Text accessibilityRole="alert" style={styles.text}>{error}</Text> : null}
      {chat === null ? <>
        <Button color={colors.button} disabled={busy} title="New conversation" onPress={() => void run(async () => {
          const item = await authRequest<Chat>("/chats", {}, token);
          setChats(previous => [item, ...previous]);
          setMessages([]);
          setText("");
          setChat(item.id);
        })} />
        {chats.map(item => <View key={item.id} style={styles.card}>
          <Button color={colors.button} disabled={busy} title={item.title} onPress={() => void open(item)} />
          <Button color={colors.accent} disabled={busy} title="Delete conversation" onPress={() => remove(item)} />
        </View>)}
      </> : <>
        <Button color={colors.button} disabled={busy} title="Back to conversations" onPress={() => void run(async () => {
          setChats(await authRequest<Chat[]>("/chats", undefined, token));
          setChat(null);
        })} />
        {messages.map(message => <View key={message.id} style={styles.card}>
          <Text style={styles.label}>{message.role === "user" ? "You" : message.role === "ai" ? "Zen Monk" : "Guided prompt"}</Text>
          <Text style={styles.text}>{message.text}</Text>
        </View>)}
        <TextInput accessibilityLabel="Reflection message" placeholder="What’s on your mind?" placeholderTextColor={colors.mutedText}
          multiline editable={!busy} maxLength={1000} value={text} onChangeText={setText} style={styles.input} />
        <Button color={colors.button} disabled={busy || !text.trim()} title={busy ? "Waiting for reply…" : "Send"} onPress={() => void run(async () => {
          setMessages(await authRequest<Message[]>("/chats/" + chat, { text }, token));
          setText("");
        })} />
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  card: { gap: 8, borderRadius: 14, padding: 12, backgroundColor: colors.softIvory },
  label: { color: colors.accent, fontWeight: "700" },
  text: { color: colors.text, fontSize: 16, lineHeight: 24 },
  input: { color: colors.text, borderColor: colors.mutedText, borderWidth: 1, borderRadius: 12, minHeight: 60, padding: 12 },
});
