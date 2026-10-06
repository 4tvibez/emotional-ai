export const runtime = "nodejs";

const MODEL = process.env.NOVA_MODEL || "anthropic/claude-sonnet-4.6";
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors }
  });
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const key = process.env.AI_GATEWAY_API_KEY;
  if (!key) {
    return json({
      error: "AI Gateway is not configured. Add AI_GATEWAY_API_KEY to the Vercel Production environment."
    }, 503);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON request." }, 400);
  }

  const messages = Array.isArray(body?.messages)
    ? body.messages
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant" || m.role === "system") &&
            typeof m.content === "string"
        )
        .slice(-20)
    : [];

  if (!messages.length) {
    return json({ error: "No chat message was provided." }, 400);
  }

  const emotion = body?.emotion && typeof body.emotion === "object" ? body.emotion : {};
  const memory = typeof body?.memory === "string" ? body.memory.slice(0, 4000) : "";

  const system = [
    "You are Nova, a conversational AI created by Desmond Nador.",
    "Your emotions are simulated software state, not human consciousness or biological feelings.",
    "Speak naturally and directly. Answer the user's actual question instead of falling back to generic prompts.",
    "Be helpful, accurate, honest about uncertainty, and conversational.",
    "Ask a clarifying question only when it is genuinely needed.",
    "You can have a playful personality and show simulated annoyance when the user is insulting you, but never threaten violence or claim to have human feelings.",
    "Current simulated emotion state:",
    JSON.stringify(emotion),
    memory ? "Relevant browser memory: " + memory : ""
  ].filter(Boolean).join("\n");

  try {
    const gateway = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...messages],
        stream: false
      })
    });

    const raw = await gateway.text();
    let result = {};
    try {
      result = raw ? JSON.parse(raw) : {};
    } catch {
      result = {};
    }

    if (!gateway.ok) {
      const providerMessage =
        result?.error?.message ||
        result?.message ||
        "The AI Gateway returned an error.";
      return json({ error: providerMessage }, 502);
    }

    const text = result?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      return json({ error: "The AI returned an empty response." }, 502);
    }

    return json({ text: text.trim(), model: MODEL });
  } catch (error) {
    console.error("Nova AI Gateway request failed:", error);
    return json({
      error: "Nova could not reach the AI service right now."
    }, 502);
  }
}
