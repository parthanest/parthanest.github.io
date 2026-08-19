/* =========================================================================
   api/cv-enhance.js  —  Vercel Serverless Function (same-origin backend)
   -------------------------------------------------------------------------
   THE TRIGGER: When the user clicks "Submit for enhancement", the frontend
   POSTs here. This function immediately:
     1. Parses the multipart form (email, prompt, CV file).
     2. Emails YOU (NOTIFY_TO / parthadevop@gmail.com) the user's details
        with the CV attached — that is the "you get the details" step.
     3. Returns a minimal { ok:true } to the browser.

   Same-origin deploy => the frontend calls the RELATIVE path "/api/cv-enhance"
   => NO CORS, NO mixed-content, NO localhost problems.

   SANITIZED: the client only ever receives { ok:true } or a generic error.
   Real errors are logged server-side (Vercel logs) with a short ref id —
   never exposed in the frontend.

   Env vars (Vercel → Settings → Environment Variables):
     GMAIL_USER, GMAIL_APP_PASSWORD, SMTP_HOST, SMTP_PORT, NOTIFY_TO
   ========================================================================= */
"use strict";

const crypto = require("crypto");
const path = require("path");
const Busboy = require("busboy");
const nodemailer = require("nodemailer");

// Vercel: disable built-in body parsing so busboy can read the raw stream.
module.exports.config = { api: { bodyParser: false } };

const ACCEPT = [".pdf", ".docx", ".txt"];
const MAX_BYTES = 5 * 1024 * 1024;

/* ---- parse multipart/form-data into { fields, file } ---- */
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_BYTES, files: 1 } });
    const fields = {};
    let file = null;
    let tooBig = false;

    bb.on("field", (name, val) => { fields[name] = val; });
    bb.on("file", (name, stream, info) => {
      const chunks = [];
      stream.on("data", (c) => chunks.push(c));
      stream.on("limit", () => { tooBig = true; stream.resume(); });
      stream.on("end", () => {
        file = { originalname: info.filename, mimetype: info.mimeType, buffer: Buffer.concat(chunks) };
      });
    });
    bb.on("error", reject);
    bb.on("close", () => (tooBig
      ? reject(Object.assign(new Error("TOO_BIG"), { code: "TOO_BIG" }))
      : resolve({ fields, file })));
    req.pipe(bb);
  });
}

/* ---- Gmail SMTP transporter ---- */
function transporter() {
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,                          // 465 = SSL, 587 = STARTTLS
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}
const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- Email YOU the submitted user details (with CV attached) ---- */
async function notifyOwner({ email, prompt, file }) {
  const to = process.env.NOTIFY_TO || process.env.GMAIL_USER;   // your inbox
  const when = new Date().toISOString();
  const sizeKb = Math.round((file.buffer.length) / 1024);

  await transporter().sendMail({
    from: `"CV Enhancer Bot" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: email,                                             // reply → the user
    subject: `🧠 New CV request · ${email} · ${file.originalname}`,
    text:
      `New CV Enhancer submission\n\n` +
      `User email : ${email}\n` +
      `File       : ${file.originalname} (${sizeKb} KB)\n` +
      `Submitted  : ${when}\n\n` +
      `Prompt:\n${prompt}\n`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">🧠 New CV Enhancement Request</h2>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 10px;color:#555">User email</td><td style="padding:4px 10px"><b>${esc(email)}</b></td></tr>
          <tr><td style="padding:4px 10px;color:#555">File</td><td style="padding:4px 10px">${esc(file.originalname)} (${sizeKb} KB)</td></tr>
          <tr><td style="padding:4px 10px;color:#555">Submitted</td><td style="padding:4px 10px">${when}</td></tr>
        </table>
        <h3 style="margin:16px 0 6px">Prompt</h3>
        <blockquote style="margin:0;padding:10px 14px;background:#f4f6fb;border-left:3px solid #4F9BFF;border-radius:6px">
          ${esc(prompt)}
        </blockquote>
        <p style="margin-top:16px;color:#666;font-size:13px">The user's original CV is attached to this email.</p>
      </div>`,
    attachments: [{ filename: file.originalname, content: file.buffer, contentType: file.mimetype }],
  });
}

/* ---- log server-side, respond generic (no internals to client) ---- */
function fail(res, status, publicMsg, ctx, err) {
  const ref = crypto.randomBytes(4).toString("hex");
  console.error(`[cv-enhance][${ref}] ${ctx}:`, err ? (err.stack || err.message || err) : "");
  res.status(status).json({ ok: false, error: publicMsg, ref });
}

/* ---- main handler ---- */
module.exports = async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed." });

  try {
    let parsed;
    try {
      parsed = await parseMultipart(req);
    } catch (e) {
      if (e.code === "TOO_BIG")
        return res.status(413).json({ ok: false, error: "File is too large (max 5 MB)." });
      return fail(res, 400, "Could not read the uploaded file.", "parse", e);
    }

    const { fields, file } = parsed;
    const email = (fields.email || "").trim();
    const prompt = (fields.prompt || "").trim();

    // Validation messages are safe to show
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, error: "A valid email is required." });
    if (!prompt || prompt.length < 8)
      return res.status(400).json({ ok: false, error: "Prompt is too short (min 8 chars)." });
    if (!file || !file.buffer || !file.buffer.length)
      return res.status(400).json({ ok: false, error: "A CV file is required." });
    if (!ACCEPT.includes(path.extname(file.originalname).toLowerCase()))
      return res.status(415).json({ ok: false, error: "Unsupported file type. Use .pdf, .docx or .txt." });

    // (Optional) LLM packaging/enhancement would go here.

    // 🔔 THE TRIGGER — email the owner with the user's details + CV.
    await notifyOwner({ email, prompt, file });

    return res.status(200).json({ ok: true });   // minimal success payload
  } catch (err) {
    return fail(res, 502, "We couldn't send the notification right now. Please try again.", "handler", err);
  }
};
