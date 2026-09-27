const MODEL = process.env.NOVA_MODEL || "anthropic/claude-sonnet-4.6";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors }
  });
}

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!key) {
    return json({
      error: "Nova's AI backend is not connected yet. Add AI_GATEWAY_API_KEY to the Vercel project environment variables."
    }, 503);
  }

  try {
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
    const emotion = body.emotion || {};
    const memory = body.memory || "";

    const system = [
      "You are Nova, a conversational AI created by Desmond Nador.",
      "Your emotions are simulated software state, not human consciousness or biological feelings.",
      "Speak naturally and directly. Answer the user's actual question instead of falling back to generic prompts.",
      "Be helpful, accurate, honest about uncertainty, and conversational. Ask a clarifying question only when it is genuinely needed.",
      "You can have a playful personality and show simulated annoyance when the user is insulting you, but never threaten violence or claim to have human feelings.",
      "Current simulated emotion state:",
      JSON.stringify(emotion),
      memory ? "Relevant browser memory: " + memory : ""
    ].filter(Boolean).join("\n");

    const gateway = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...messages],
        stream: false
      })
    });

    const result = await gateway.json();
    if (!gateway.ok) {
      return json({ error: result?.error?.message || "The AI provider returned an error." }, gateway.status);
    }

    const text = result?.choices?.[0]?.message?.content;
    if (!text) return json({ error: "The AI returned an empty response." }, 502);

    return json({ text, model: MODEL });
  } catch (error) {
    return json({ error: "Nova could not reach the AI service right now." }, 500);
  }
}
