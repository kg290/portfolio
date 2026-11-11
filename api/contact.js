import postgres from "postgres";

const DATABASE_URL =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL;

let sql;
let schemaReady = false;

function getDatabaseClient() {
  if (!DATABASE_URL) {
    throw new Error("Database is not configured. Set POSTGRES_URL or DATABASE_URL.");
  }

  if (!sql) {
    sql = postgres(DATABASE_URL, {
      ssl: "require",
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  return sql;
}

async function ensureSchema(db) {
  if (schemaReady) return;

  await db.unsafe(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGSERIAL PRIMARY KEY,
      full_name VARCHAR(140) NOT NULL,
      email VARCHAR(190) NOT NULL,
      message TEXT NOT NULL,
      source VARCHAR(80) NOT NULL DEFAULT 'portfolio-contact-form',
      ip_address VARCHAR(80),
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  schemaReady = true;
}

function readBody(req) {
  if (!req.body) return {};

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body;
}

function normalizeText(value, maxLength = 4000) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  try {
    const body = readBody(req);
    const name = normalizeText(body.name, 140);
    const email = normalizeText(body.email, 190);
    const message = normalizeText(body.message, 4000);
    const source = normalizeText(body.source || "portfolio-contact-form", 80);
    const company = normalizeText(body.company, 120);

    if (company) {
      return res.status(200).json({ ok: true, message: "Saved." });
    }

    if (name.length < 2) {
      return res.status(400).json({ ok: false, message: "Name is too short." });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ ok: false, message: "Invalid email address." });
    }

    if (message.length < 10) {
      return res.status(400).json({ ok: false, message: "Message is too short." });
    }

    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : String(forwardedFor || "").split(",")[0].trim() || null;

    const userAgent = normalizeText(req.headers["user-agent"], 900) || null;

    const db = getDatabaseClient();
    await ensureSchema(db);

    await db`
      INSERT INTO contact_submissions (
        full_name,
        email,
        message,
        source,
        ip_address,
        user_agent
      ) VALUES (
        ${name},
        ${email},
        ${message},
        ${source},
        ${ipAddress},
        ${userAgent}
      )
    `;

    return res
      .status(200)
      .json({ ok: true, message: "Message saved in backend database." });
  } catch (error) {
    console.error("Contact submission failed", error);
    return res.status(500).json({
      ok: false,
      message: "Unable to save your message right now. Please try again.",
    });
  }
}
