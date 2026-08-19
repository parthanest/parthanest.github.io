/* =========================================================================
   server/server.js — lightweight Express backend for the CV Enhancer.

   SECURITY POSTURE (per request):
   - The client NEVER receives internal details: no stack traces, no error
     messages from mail/multer internals, no request IDs beyond a short
     correlation id, no server SHA/version. Full detail is logged SERVER-SIDE
     only (console.error), so logs stay on the backend and out of the UI.
   - Success responses are minimal: { ok: true }.
   ========================================================================= */
"use strict";

require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { sendCvNotification } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 8080;

/* ---- CORS allow-list ---- */
const allowed = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,https://parthanest.github.io")
  .split(",").map((s) => s.trim());
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error("Origin not allowed by CORS"));
  },
}));
app.use(express.json());

/* ---- Multer: in-memory, size cap, type filter ---- */
const ACCEPT = [".pdf", ".docx", ".txt"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ACCEPT.includes(ext)) return cb(null, true);
    cb(new Error("BAD_TYPE"));
  },
});

/* ---- Health ---- */
app.get("/health", (req, res) => res.json({ ok: true, service: "cv-enhancer" }));

/* ---- Helper: log server-side only, respond with a generic message ---- */
function fail(res, status, publicMsg, logCtx, err) {
  const ref = crypto.randomBytes(4).toString("hex"); // short correlation id
  // Full detail stays in the server log — never sent to the client.
  console.error(`[cv-enhance][${ref}] ${logCtx}:`, err ? (err.stack || err.message || err) : "");
  return res.status(status).json({ ok: false, error: publicMsg, ref });
}

/* ---- Main handler ---- */
app.post("/api/cv-enhance", (req, res) => {
  upload.single("cv")(req, res, async (uploadErr) => {
    // Multer errors → clean, generic client messages
    if (uploadErr) {
      if (uploadErr.code === "LIMIT_FILE_SIZE")
        return fail(res, 413, "File is too large (max 5 MB).", "multer size", uploadErr);
      if (uploadErr.message === "BAD_TYPE")
        return fail(res, 415, "Unsupported file type. Use .pdf, .docx or .txt.", "multer type", uploadErr);
      return fail(res, 400, "Could not read the uploaded file.", "multer", uploadErr);
    }

    try {
      const { email, prompt } = req.body;
      const file = req.file;

      // Validation messages are safe to show
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ ok: false, error: "A valid email is required." });
      if (!prompt || prompt.trim().length < 8)
        return res.status(400).json({ ok: false, error: "Prompt is too short (min 8 chars)." });
      if (!file)
        return res.status(400).json({ ok: false, error: "A CV file is required." });

      // (Optional) LLM packaging/enhancement would go here.

      // Send the Gmail SMTP notification. On ANY failure, the client gets a
      // generic message; the real SMTP error is logged server-side only.
      await sendCvNotification({ email, prompt, file });

      // Minimal success payload — nothing internal exposed.
      return res.json({ ok: true });
    } catch (err) {
      return fail(res, 502, "We couldn't send the notification right now. Please try again.", "send", err);
    }
  });
});

/* ---- Last-resort error handler: still no internals to the client ---- */
app.use((err, req, res, next) => {
  if (!err) return next();
  return fail(res, 500, "Something went wrong. Please try again.", "unhandled", err);
});

app.listen(PORT, () => {
  console.log(`✅ CV Enhancer backend on http://localhost:${PORT}`);
  console.log(`   Allowed origins: ${allowed.join(", ")}`);
});
