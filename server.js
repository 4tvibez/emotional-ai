import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createConversationEngine } from "./src/conversation.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const engine = createConversationEngine();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

async function body(req) {
  let data = "";
  for await (const chunk of req) data += chunk;
  if (!data) return {};
  try { return JSON.parse(data); } catch { return {}; }
}

function send(res, status, value, type = "application/json; charset=utf-8") {
  res.writeHead(status, {"Content-Type": type});
  res.end(type.startsWith("application/json") ? JSON.stringify(value) : value);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "POST" && url.pathname === "/api/chat") {
      const input = await body(req);
      return send(res, 200, await engine.reply(String(input.message ?? "")));
    }
    if (req.method === "GET" && url.pathname === "/api/state") {
      return send(res, 200, engine.state());
    }
    if (req.method === "POST" && url.pathname === "/api/reset") {
      await engine.reset();
      return send(res, 200, engine.state());
    }
    if (req.method === "GET") {
      const safePath = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = join(publicDir, safePath.replace(/^\/+/, ""));
      if (!file.startsWith(publicDir)) return send(res, 403, {error:"Forbidden"});
      try {
        const content = await readFile(file);
        return send(res, 200, content, mime[extname(file)] ?? "application/octet-stream");
      } catch {}
    }
    send(res, 404, {error:"Not found"});
  } catch (error) {
    send(res, 500, {error:"Server error", detail:error.message});
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Emotional AI running on port " + (process.env.PORT || 3000));
});
