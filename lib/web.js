const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { startWhatsApp, stopWhatsAppSession } = require("./whatsapp");
const config = require("../config");

const WEB_ROOT = path.join(__dirname, "..", "web");
const STATIC_FILES = new Map([
  ["/style.css", { file: "style.css", type: "text/css; charset=utf-8" }],
  ["/app.js", { file: "app.js", type: "text/javascript; charset=utf-8" }],
  ["/qrcode.js", { file: "qrcode.js", type: "text/javascript; charset=utf-8" }],
  ["/sc-bug.zip", { file: "sc-bug.zip", type: "application/zip" }],
  ["/assets/whatsapp.svg", { file: path.join("assets", "whatsapp.svg"), type: "image/svg+xml" }],
  ["/assets/telegram.svg", { file: path.join("assets", "telegram.svg"), type: "image/svg+xml" }],
]);
const PAIRING_TIMEOUT_MS = 30_000;
const IP_WINDOW_MS = 10 * 60 * 1000;
const PHONE_WINDOW_MS = 60 * 1000;
const MAX_IP_REQUESTS = 5;
const QR_SESSION_TTL_MS = 180_000;

const ipAttempts = new Map();
const phoneAttempts = new Map();
const pairingInFlight = new Set();
const qrAttempts = new Map();
const qrSessions = new Map();

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
  });
  res.end(payload);
}

function sendText(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  });
  res.end(body);
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .split(",")[0]
    .trim()
    .replace(/^::ffff:/, "") || "unknown";
}

function allowedByRateLimit(map, key, windowMs, maxRequests) {
  const now = Date.now();
  const previous = (map.get(key) || []).filter((time) => now - time < windowMs);
  if (previous.length >= maxRequests) {
    map.set(key, previous);
    return false;
  }
  previous.push(now);
  map.set(key, previous);
  return true;
}

function normalizePhone(phoneNumber) {
  const phone = String(phoneNumber || "")
    .replace(/\D/g, "")
    .replace(/^00/, "");
  return /^\d{8,15}$/.test(phone) ? phone : null;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 8 * 1024) {
        reject(new Error("Request too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function requestPairingCode(phoneNumber) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("The pairing code took too long to generate."));
      }
    }, PAIRING_TIMEOUT_MS);

    startWhatsApp({
      phoneNumber,
      authSubdir: phoneNumber,
      onPairingCode: (code, error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (error || !code) {
          reject(error || new Error("Pairing code was not generated."));
        } else {
          resolve(code);
        }
      },
    }).catch((error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

async function handlePairRequest(req, res) {
  const ip = clientIp(req);
  if (!allowedByRateLimit(ipAttempts, ip, IP_WINDOW_MS, MAX_IP_REQUESTS)) {
    return sendJson(res, 429, {
      error: "Too many requests. Please wait a few minutes before trying again.",
    });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: error.message });
  }

  const phoneNumber = normalizePhone(body.phoneNumber);
  if (!phoneNumber) {
    return sendJson(res, 400, {
      error: "Enter a valid international WhatsApp number (for example, 242xxxxxx).",
    });
  }
  if (!allowedByRateLimit(phoneAttempts, phoneNumber, PHONE_WINDOW_MS, 1)) {
    return sendJson(res, 429, {
      error: "A code was already requested for this number. Please wait 60 seconds.",
    });
  }
  if (pairingInFlight.has(phoneNumber)) {
    return sendJson(res, 409, {
      error: "A pairing request is already in progress for this number.",
    });
  }

  pairingInFlight.add(phoneNumber);
  try {
    const code = await requestPairingCode(phoneNumber);
    return sendJson(res, 200, {
      code,
      phoneNumber: `+${phoneNumber}`,
      expiresIn: 60,
    });
  } catch (error) {
    console.error("❌ Web pairing error:", error.message);
    return sendJson(res, 502, {
      error: "WhatsApp could not generate a pairing code. Try again later.",
    });
  } finally {
    pairingInFlight.delete(phoneNumber);
  }
}

async function handleQrStart(req, res) {
  const activeQrCount = [...qrSessions.values()].filter((item) => item.state === "starting" || item.state === "waiting").length;
  if (activeQrCount >= 10) {
    return sendJson(res, 503, { error: "QR pairing is busy. Please try again in a few minutes." });
  }
  const ip = clientIp(req);
  if (!allowedByRateLimit(qrAttempts, ip, IP_WINDOW_MS, 3)) {
    return sendJson(res, 429, { error: "Too many QR requests. Please wait before trying again." });
  }

  const sessionId = crypto.randomBytes(24).toString("hex");
  const authSubdir = "webqr_" + sessionId;
  const session = {
    id: sessionId,
    authSubdir,
    state: "starting",
    qr: null,
    expiresAt: Date.now() + QR_SESSION_TTL_MS,
    expiryTimer: null,
    cleanupTimer: null,
  };
  qrSessions.set(sessionId, session);
  session.expiryTimer = setTimeout(async () => {
    if (session.state === "connected") return;
    session.state = "expired";
    session.qr = null;
    await stopWhatsAppSession(authSubdir).catch(() => {});
    session.cleanupTimer = setTimeout(() => qrSessions.delete(sessionId), 60_000);
    if (session.cleanupTimer.unref) session.cleanupTimer.unref();
  }, QR_SESSION_TTL_MS);
  if (session.expiryTimer.unref) session.expiryTimer.unref();

  startWhatsApp({
    authSubdir,
    onQRCode: (qr) => {
      if (session.state === "starting" || session.state === "waiting") {
        session.qr = qr;
        session.state = "waiting";
      }
    },
    onConnected: () => {
      session.state = "connected";
      session.qr = null;
      clearTimeout(session.expiryTimer);
      session.cleanupTimer = setTimeout(() => qrSessions.delete(sessionId), 30 * 60_000);
      if (session.cleanupTimer.unref) session.cleanupTimer.unref();
    },
  }).catch((error) => {
    console.error("❌ Web QR pairing error:", error.message);
    session.state = "error";
    session.qr = null;
    clearTimeout(session.expiryTimer);
    session.cleanupTimer = setTimeout(() => qrSessions.delete(sessionId), 60_000);
    if (session.cleanupTimer.unref) session.cleanupTimer.unref();
  });

  return sendJson(res, 202, {
    sessionId,
    state: session.state,
    expiresIn: Math.ceil(QR_SESSION_TTL_MS / 1000),
  });
}

async function handleQrStatus(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: error.message });
  }
  const sessionId = String(body.sessionId || "");
  if (!/^[a-f0-9]{48}$/.test(sessionId)) {
    return sendJson(res, 400, { error: "Invalid QR session." });
  }
  const session = qrSessions.get(sessionId);
  if (!session) return sendJson(res, 404, { error: "QR session not found or expired." });
  return sendJson(res, 200, {
    state: session.state,
    qr: session.state === "waiting" ? session.qr : null,
    expiresIn: Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 1000)),
  });
}

function serveStatic(res, requestPath) {
  const asset = STATIC_FILES.get(requestPath);
  if (!asset) return false;
  try {
    const body = fs.readFileSync(path.join(WEB_ROOT, asset.file));
    res.writeHead(200, {
      "Content-Type": asset.type,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    });
    res.end(body);
  } catch {
    sendText(res, 404, "Asset unavailable.");
  }
  return true;
}

function serveAvatar(res) {
  try {
    const image = fs.readFileSync(config.MENU_IMAGE);
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    return res.end(image);
  } catch {
    return sendText(res, 404, "Avatar unavailable.");
  }
}

function serveHome(res) {
  try {
    const html = fs.readFileSync(path.join(WEB_ROOT, "index.html"), "utf8");
    return sendText(res, 200, html, "text/html; charset=utf-8");
  } catch {
    return sendText(res, 500, "Website unavailable.");
  }
}

function startWebServer({ port = process.env.PORT || 10_000 } = {}) {
  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && serveStatic(res, requestUrl.pathname)) return;
    if (req.method === "GET" && requestUrl.pathname === "/assets/dentsu-mini-bot-avatar.png") {
      return serveAvatar(res);
    }
    if (req.method === "GET" && requestUrl.pathname === "/") {
      return serveHome(res);
    }
    if (req.method === "GET" && requestUrl.pathname === "/health") {
      return sendJson(res, 200, { ok: true, service: "dentsu-mini-bot" });
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/pair") {
      return handlePairRequest(req, res);
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/qr/start") {
      return handleQrStart(req, res);
    }
    if (req.method === "POST" && requestUrl.pathname === "/api/qr/status") {
      return handleQrStatus(req, res);
    }
    return sendJson(res, 404, { error: "Not found." });
  });

  server.on("error", (error) => {
    console.error("❌ Web server error:", error.message);
  });
  server.listen(Number(port), "0.0.0.0", () => {
    console.log(`🌐 Pairing website listening on port ${port}`);
  });
  return server;
}

module.exports = { startWebServer };