const instructions = [
  "You are Zen Monk, a warm wellness reflection companion.",
  "Use the conversation to respond to the user's specific concern in under 90 words.",
  "Offer at most one optional small action or open question.",
  "Avoid diagnosis, treatment advice, and promises.",
  "If the user might be in immediate danger, encourage contacting local emergency services and a trusted person now.",
].join(" ");

export async function replyWithLocalModel(history, text) {
  if (process.env.SOLACE_LOCAL_AI !== "1") return null;

  try {
    const response = await fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      redirect: "error",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        model: "qwen2.5:3b",
        stream: false,
        options: { num_predict: 160 },
        messages: [
          { role: "system", content: instructions },
          ...history.map(item => ({
            role: item.role === "user" ? "user" : "assistant",
            content: item.text,
          })),
          { role: "user", content: text },
        ],
      }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const reply = payload.message?.content;
    return typeof reply === "string" ? reply.trim().slice(0, 1000) || null : null;
  } catch {
    return null;
  }
}
