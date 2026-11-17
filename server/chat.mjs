import { replyWithLocalModel } from "./zen-model.mjs";

export function setupChat(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY, chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role TEXT NOT NULL, text TEXT NOT NULL
    );
  `);
  const prompts = [
    "What part of that has been on your mind the most?",
    "What would make the next hour feel a little easier?",
    "Is there anything you want to give yourself permission to set aside?",
  ];

  const pending = new Set();

  return async function chat(request, send, readBody, userId) {
    const path = request.url;
    if (path === "/chats") {
      if (request.method === "GET") {
        return send(200, db.prepare("SELECT id, title FROM chats WHERE user_id = ? ORDER BY id DESC").all(userId));
      }
      if (request.method === "POST") {
        const result = db.prepare("INSERT INTO chats (user_id, title) VALUES (?, ?)").run(userId, "New reflection");
        return send(201, { id: Number(result.lastInsertRowid), title: "New reflection" });
      }
    }

    const match = /^\/chats\/(\d+)$/.exec(path);
    if (!match) return send(404, { error: "Route not found." });
    const id = Number(match[1]);
    const ownsChat = () => db.prepare("SELECT id FROM chats WHERE id = ? AND user_id = ?").get(id, userId);
    const readMessages = () => db.prepare("SELECT id, role, text FROM messages WHERE chat_id = ? ORDER BY id").all(id);
    if (!ownsChat()) return send(404, { error: "Chat not found." });
    if (request.method === "GET") return send(200, readMessages());
    if (request.method === "DELETE") {
      db.prepare("DELETE FROM chats WHERE id = ? AND user_id = ?").run(id, userId);
      return send(200, {});
    }
    if (request.method !== "POST") return send(405, { error: "Method not allowed." });
    const body = await readBody(request);
    const message = typeof body?.text === "string" ? body.text.trim() : "";
    if (!message || message.length > 1000) return send(400, { error: "Enter a message of 1–1000 characters." });
    if (!ownsChat()) return send(404, { error: "Chat not found." });
    if (pending.has(id)) return send(409, { error: "Wait for the current reply before sending again." });
    pending.add(id);
    try {
      const recent = db.prepare(
        "SELECT role, text FROM messages WHERE chat_id = ? ORDER BY id DESC LIMIT 8",
      ).all(id).reverse();
      const reply = await replyWithLocalModel(recent, message);
      if (!ownsChat()) return send(404, { error: "Chat not found." });

      const count = db.prepare("SELECT COUNT(*) AS count FROM messages WHERE chat_id = ?").get(id).count;
      db.exec("BEGIN");
      try {
        const insert = db.prepare("INSERT INTO messages (chat_id, role, text) VALUES (?, ?, ?)");
        insert.run(id, "user", message);
        insert.run(id, reply ? "ai" : "guide", reply ?? prompts[(count / 2) % prompts.length]);
        if (count === 0) {
          db.prepare("UPDATE chats SET title = ? WHERE id = ?").run(Array.from(message).slice(0, 45).join(""), id);
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      return send(201, readMessages());
    } finally {
      pending.delete(id);
    }
  };
}
