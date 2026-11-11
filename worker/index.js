// Cloudflare Worker: serves the built site and runs the same contact handler as Vercel's api/contact.js.
import handler, { closeDatabase } from "../api/contact.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);

    const headers = Object.fromEntries(request.headers);
    headers["x-forwarded-for"] = request.headers.get("cf-connecting-ip") || "";

    const req = {
      method: request.method,
      headers,
      body: request.method === "POST" ? await request.text() : null,
    };

    // Minimal stand-in for the Vercel/Node response object the handler expects.
    const out = { status: 200, headers: {}, body: null };
    const res = {
      setHeader(name, value) {
        out.headers[name] = value;
      },
      status(code) {
        out.status = code;
        return res;
      },
      json(data) {
        out.headers["Content-Type"] = "application/json";
        out.body = JSON.stringify(data);
        return res;
      },
      end() {
        return res;
      },
    };

    await handler(req, res);
    ctx.waitUntil(closeDatabase());

    return new Response(out.body, { status: out.status, headers: out.headers });
  },
};
