import { createServer } from "node:http";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { promisify } from "node:util";

const deriveKey = promisify(scrypt);
mkdirSync(new URL("./data/", import.meta.url), { recursive: true });
const db = new DatabaseSync(new URL("./data/solace.sqlite", import.meta.url));
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    salt TEXT NOT NULL, password_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at INTEGER NOT NULL
  );
`);
const hashToken = token => createHash("sha256").update(token).digest("hex");
const findUser = db.prepare("SELECT * FROM users WHERE email = ?");
const attempts = new Map();

async function readBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8192) return null;
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString()); }
  catch { return null; }
}

const server = createServer(async (request, response) => {
  function send(status, body) {
    response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    response.end(JSON.stringify(body));
  }

  try {
    const path = request.url;
    if (request.method === "POST" && (path === "/auth/signup" || path === "/auth/login")) {
      const now = Date.now();
      for (const [ip, entry] of attempts) {
        if (entry.until <= now) attempts.delete(ip);
      }
      const ip = request.socket.remoteAddress ?? "unknown";
      const limit = attempts.get(ip) ?? { count: 0, until: now + 60_000 };
      if (limit.count >= 12) return send(429, { error: "Try again in a minute." });
      limit.count++;
      attempts.set(ip, limit);

      const body = await readBody(request);
      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body?.password === "string" ? body.password : "";
      const name = typeof body?.name === "string" ? body.name.trim() : "";
      const signup = path === "/auth/signup";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
          password.length < 8 || password.length > 128 || (signup && (!name || name.length > 80))) {
        return send(400, { error: "Enter a valid email, a password of 8–128 characters, and a name when signing up." });
      }

      let user = findUser.get(email);
      if (signup) {
        const salt = randomBytes(16).toString("hex");
        const key = await deriveKey(password, salt, 64);
        const result = db.prepare(
          "INSERT INTO users (name, email, salt, password_hash) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO NOTHING",
        ).run(name, email, salt, key.toString("hex"));
        if (!result.changes) return send(409, { error: "An account already uses this email." });
        user = findUser.get(email);
      } else {
        const key = await deriveKey(password, user?.salt ?? "solace-login-placeholder", 64);
        if (!user || !timingSafeEqual(key, Buffer.from(user.password_hash, "hex"))) {
          return send(401, { error: "Email or password is incorrect." });
        }
      }

      const token = randomBytes(32).toString("base64url");
      db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
      db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(hashToken(token), user.id, now + 7 * 86400_000);
      return send(signup ? 201 : 200, { token, name: user.name });
    }

    if ((path === "/auth/me" && request.method === "GET") ||
        (path === "/auth/logout" && request.method === "POST")) {
      const token = /^Bearer ([A-Za-z0-9_-]{43})$/.exec(request.headers.authorization ?? "")?.[1];
      if (!token) return send(401, { error: "Please log in." });
      const hash = hashToken(token);
      if (path === "/auth/logout") {
        db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash);
        return send(200, {});
      }
      const profile = db.prepare(`
        SELECT users.name FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE token_hash = ? AND expires_at > ?
      `).get(hash, Date.now());
      return profile ? send(200, profile) : send(401, { error: "Please log in." });
    }
    send(404, { error: "Route not found." });
  } catch {
    if (!response.headersSent) send(500, { error: "The server could not complete this request." });
  }
});

server.listen(Number(process.env.PORT ?? 4000), process.env.HOST ?? "127.0.0.1", () => {
  console.log("Solace API listening", server.address());
});
