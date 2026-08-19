/* =========================================================================
   server/mailer.js
   -------------------------------------------------------------------------
   Email dispatch utility built on nodemailer + Gmail SMTP.

   Reads configuration from environment variables (see .env.example):
     GMAIL_USER            e.g. parthadevop@gmail.com
     GMAIL_APP_PASSWORD    16-char Google App Password (NOT your login password)
     SMTP_HOST             smtp.gmail.com          (default)
     SMTP_PORT             587 (STARTTLS) or 465 (SSL)  (default 587)
     NOTIFY_TO             inbox that receives notifications (default = GMAIL_USER)

   Exposes:
     createTransport()   -> configured nodemailer transporter
     sendCvNotification({ email, prompt, file }) -> sends the email w/ attachment
   ========================================================================= */

"use strict";

const nodemailer = require("nodemailer");

/* ---- Build a Gmail SMTP transporter from env vars ---- */
function createTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in environment.");
  }

  return nodemailer.createTransport({
    host,
    port,
    // port 465 => implicit SSL (secure:true); 587 => STARTTLS (secure:false)
    secure: port === 465,
    auth: { user, pass },        // Gmail requires an App Password (2FA on)
  });
}

/* ---- Send the CV-enhancer notification email ---- */
async function sendCvNotification({ email, prompt, file }) {
  const transporter = createTransport();
  const to = process.env.NOTIFY_TO || process.env.GMAIL_USER;
  const from = `"CV Enhancer Bot" <${process.env.GMAIL_USER}>`;

  const submittedAt = new Date().toISOString();

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">🧠 New CV Enhancement Request</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 10px;color:#555">From</td><td style="padding:4px 10px"><b>${escapeHtml(email)}</b></td></tr>
        <tr><td style="padding:4px 10px;color:#555">File</td><td style="padding:4px 10px">${escapeHtml(file.originalname)} (${(file.size/1024).toFixed(0)} KB)</td></tr>
        <tr><td style="padding:4px 10px;color:#555">Submitted</td><td style="padding:4px 10px">${submittedAt}</td></tr>
      </table>
      <h3 style="margin:16px 0 6px">Prompt</h3>
      <blockquote style="margin:0;padding:10px 14px;background:#f4f6fb;border-left:3px solid #4F9BFF;border-radius:6px">
        ${escapeHtml(prompt)}
      </blockquote>
      <p style="margin-top:16px;color:#666;font-size:13px">The original CV is attached to this email.</p>
    </div>`;

  const info = await transporter.sendMail({
    from,
    to,
    replyTo: email,                         // reply goes straight to the requester
    subject: `CV Enhancer · ${file.originalname} · ${email}`,
    text: `New CV request from ${email}\nFile: ${file.originalname}\nPrompt: ${prompt}\nSubmitted: ${submittedAt}`,
    html,
    attachments: [
      { filename: file.originalname, content: file.buffer, contentType: file.mimetype },
    ],
  });

  return info.messageId;
}

/* ---- tiny HTML escaper for safe email rendering ---- */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

module.exports = { createTransport, sendCvNotification };
