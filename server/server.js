/* =========================================================================
   server/server.js
   -------------------------------------------------------------------------
   Lightweight Express backend for the CV Enhancer.

   Endpoints:
     GET  /health           -> quick liveness check
     POST /api/cv-enhance   -> multipart form { email, prompt, cv(file) }
                               → (optional LLM step) → Gmail SMTP notification

   Run:
     cd server && npm install && cp ../.env.example .env  (fill it in) && npm start
   ========================================================================= */

"use strict";

require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { sendCvNotification } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 8080;

/* ---- CORS: allow only your site origin(s) ---- */
const allowed = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:3000,https://parthanest.github.io")
  .split(",").map((s) => s.trim());
app.use(cors({
  origin(origin, cb) {
    // allow same-origin / curl (no origin) and any whitelisted origin
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error("Origin not allowed by CORS"));
  },
}));

app.use(express.json());

/* ---- Multer: keep the upload in memory, cap size, filter type ---- */
const ACCEPT = [".pdf", ".docx", ".txt"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ACCEPT.includes(ext)) return cb(null, true);
    cb(new Error("Unsupported file type. Use .pdf, .docx or .txt."));
  },
});

/* ---- Liveness ---- */
app.get("/health", (req, res) => res.json({ ok: true, service: "cv-enhancer", time: new Date().toISOString() }));

/* ---- Main handler ---- */
app.post("/api/cv-enhance", upload.single("cv"), async (req, res) => {
  try {
    const { email, prompt } = req.body;
    const file = req.file;

    // --- validate ---
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, error: "Valid email is required." });
    if (!prompt || prompt.trim().length < 8)
      return res.status(400).json({ ok: false, error: "Prompt too short (min 8 chars)." });
    if (!file)
      return res.status(400).json({ ok: false, error: "CV file is required." });

    // --- (optional) LLM integration placeholder ---------------------------
    // Package/parse the CV text here and call your LLM if desired, e.g.:
    //   const enhanced = await enhanceWithLLM(file.buffer, prompt);
    // For now we simply forward the original file to the notification email.
    // ---------------------------------------------------------------------

    // --- send the Gmail SMTP notification ---
    const messageId = await sendCvNotification({ email, prompt, file });

    return res.json({
      ok: true,
      message: "CV received and notification email sent.",
      messageId,
    });
  } catch (err) {
    console.error("cv-enhance error:", err.message);
    return res.status(500).json({ ok: false, error: "Failed to process request." });
  }
});

/* ---- Multer / generic error handler (nice JSON instead of HTML) ---- */
app.use((err, req, res, next) => {
  if (err) {
    const code = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(code).json({ ok: false, error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`✅ CV Enhancer backend listening on http://localhost:${PORT}`);
  console.log(`   Allowed origins: ${allowed.join(", ")}`);
});
