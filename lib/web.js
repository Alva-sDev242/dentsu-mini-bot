const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const path = require("path");
const { URL } = require("url");
const { startWhatsApp, stopWhatsApp } = require("./whatsapp");
const QRCode = require("qrcode-terminal/vendor/QRCode");
const QRErrorCorrectLevel = require("qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel");
const config = require("../config");

const WEB_ROOT = path.join(__dirname, "..", "web");
const PAIRING_TIMEOUT_MS = 30_000;
const IP_WINDOW_MS = 10 * 60 * 1000;
const PHONE_WINDOW_MS = 60 * 1000;
const MAX_IP_REQUESTS = 5;
const QR_SESSION_TTL_MS = 2 * 60 * 1000;
const QR_SESSION_RETENTION_MS = 10 * 60 * 1000;
const MAX_QR_SESSIONS = 50;

const ipAttempts = new Map();
const phoneAttempts = new Map();
const pairingInFlight = new Set();
const qrSessions = new Map();

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
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


function renderQrSvg(value) {
  const qr = new QRCode(-1, QRErrorCorrectLevel.M);
  qr.addData(value);
  qr.make();
  const modules = qr.modules;
  const size = modules.length;
  const quietZone = 4;
  const paths = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row][col]) paths.push("M" + (col + quietZone) + " " + (row + quietZone) + "h1v1h-1z");
    }
  }
  const dimension = size + quietZone * 2;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dimension + ' ' + dimension + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="' + paths.join("") + '" fill="#10274a"/></svg>';
}

function pruneQrSessions() {
  const now = Date.now();
  for (const [sessionId, state] of qrSessions) {
    if (now - state.createdAt > QR_SESSION_RETENTION_MS) {
      qrSessions.delete(sessionId);
      if (state.status !== "connected") stopWhatsApp(sessionId).catch(() => {});
    }
  }
}

function handleQrStart(req, res) {
  const ip = clientIp(req);
  if (!allowedByRateLimit(ipAttempts, ip, IP_WINDOW_MS, MAX_IP_REQUESTS)) {
    return sendJson(res, 429, { error: "Too many requests. Please wait a few minutes before trying again." });
  }
  pruneQrSessions();
  if (qrSessions.size >= MAX_QR_SESSIONS) {
    return sendJson(res, 503, { error: "Too many QR sessions are active. Please try again shortly." });
  }

  const sessionId = "qr-" + crypto.randomBytes(12).toString("hex");
  const state = { status: "starting", svg: null, createdAt: Date.now(), error: null, expiryTimer: null };
  qrSessions.set(sessionId, state);
  state.expiryTimer = setTimeout(() => {
    if (state.status === "connected") return;
    state.status = "expired";
    state.svg = null;
    state.error = null;
    stopWhatsApp(sessionId).catch(() => {});
  }, QR_SESSION_TTL_MS);

  startWhatsApp({
    authSubdir: sessionId,
    qrOnly: true,
    onQr: (value) => {
      if (qrSessions.get(sessionId) !== state || state.status === "expired") return;
      try {
        state.svg = renderQrSvg(value);
        state.status = "ready";
        state.error = null;
      } catch (error) {
        state.status = "error";
        state.error = "Could not render the WhatsApp QR code.";
        console.error("❌ QR rendering error:", error.message);
      }
    },
    onConnected: () => {
      state.status = "connected";
      state.svg = null;
      state.error = null;
      clearTimeout(state.expiryTimer);
    },
    onConnectionClose: ({ loggedOut }) => {
      if (state.status === "connected" || state.status === "expired") return;
      if (loggedOut) {
        state.status = "error";
        state.svg = null;
        state.error = "WhatsApp closed this QR pairing session.";
      }
    },
  }).catch((error) => {
    state.status = "error";
    state.svg = null;
    state.error = "WhatsApp could not start a QR pairing session.";
    clearTimeout(state.expiryTimer);
    console.error("❌ Web QR error:", error.message);
  });

  return sendJson(res, 202, { sessionId, status: state.status });
}

function handleQrStatus(sessionId, res) {
  const state = qrSessions.get(sessionId);
  if (!state) return sendJson(res, 404, { error: "QR session not found or expired." });
  if (state.status !== "connected" && Date.now() - state.createdAt >= QR_SESSION_TTL_MS) {
    state.status = "expired";
    state.svg = null;
    clearTimeout(state.expiryTimer);
    stopWhatsApp(sessionId).catch(() => {});
  }
  return sendJson(res, 200, {
    status: state.status,
    svg: state.svg,
    error: state.error,
    expiresIn: state.status === "connected" ? null : Math.max(0, QR_SESSION_TTL_MS - (Date.now() - state.createdAt)),
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


function serveWebAsset(res, filename, contentType) {
  try {
    const asset = fs.readFileSync(path.join(WEB_ROOT, filename));
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    });
    return res.end(asset);
  } catch {
    return sendText(res, 404, "Asset unavailable.");
  }
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

    if (req.method === "GET" && requestUrl.pathname === "/style.css") {
      return serveWebAsset(res, "style.css", "text/css; charset=utf-8");
    }
    if (req.method === "GET" && requestUrl.pathname === "/app.js") {
      return serveWebAsset(res, "app.js", "application/javascript; charset=utf-8");
    }
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
    if (req.method === "POST" && requestUrl.pathname === "/api/qr") {
      return handleQrStart(req, res);
    }
    const qrMatch = requestUrl.pathname.match(/^\/api\/qr\/(qr-[a-f0-9]{24})$/);
    if (req.method === "GET" && qrMatch) {
      return handleQrStatus(qrMatch[1], res);
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