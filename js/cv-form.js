/* =========================================================================
   js/cv-form.js
   -------------------------------------------------------------------------
   Client-side handler for the CV Enhancer form:
     1. Validates email / prompt / file (type + size).
     2. Builds a multipart/form-data payload (fields + file).
     3. POSTs it to the backend (/api/cv-enhance).
     4. Manages loading spinner, inline status + success/error toasts.

   Configure API_ENDPOINT to point at your deployed backend:
     - local dev  : http://localhost:8080/api/cv-enhance
     - production : https://<your-backend-host>/api/cv-enhance
   ========================================================================= */

(function () {
  "use strict";

  const API_ENDPOINT = "http://localhost:8080/api/cv-enhance";
  const MAX_FILE_MB = 5;
  const ACCEPT_EXT = [".pdf", ".docx", ".txt"];

  const form     = document.getElementById("cvForm");
  if (!form) return;
  const emailEl  = document.getElementById("cvEmail");
  const promptEl = document.getElementById("cvPrompt");
  const fileEl   = document.getElementById("cvFile");
  const dropEl   = document.getElementById("cvDrop");
  const chosenEl = document.getElementById("cvFileChosen");
  const submit   = document.getElementById("cvSubmit");
  const statusEl = document.getElementById("cvStatus");

  /* ---- Toast helper ---- */
  function toast(kind, title, msg) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    const el = document.createElement("div");
    el.className = "toast " + (kind === "ok" ? "ok" : kind === "err" ? "err" : "");
    const icon = kind === "ok" ? "✅" : kind === "err" ? "⛔" : "ℹ️";
    el.innerHTML = `<span class="toast-icon">${icon}</span>
      <div class="toast-body"><strong>${title}</strong><span>${msg}</span></div>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .4s, transform .4s";
      el.style.opacity = "0"; el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 420);
    }, 5200);
  }
  const setStatus = (kind, text) => { statusEl.className = "cv-status " + kind; statusEl.textContent = text; };

  /* ---- File selection UX (click + drag/drop) ---- */
  const extOf = (n) => n.slice(n.lastIndexOf(".")).toLowerCase();
  function showChosen(file) {
    chosenEl.classList.add("show");
    chosenEl.innerHTML = `📄 ${file.name} <span style="color:var(--text-muted)">(${(file.size/1024).toFixed(0)} KB)</span>`;
  }
  fileEl.addEventListener("change", () => { if (fileEl.files[0]) showChosen(fileEl.files[0]); });
  ["dragenter", "dragover"].forEach((ev) =>
    dropEl.addEventListener(ev, (e) => { e.preventDefault(); dropEl.classList.add("dragover"); }));
  ["dragleave", "drop"].forEach((ev) =>
    dropEl.addEventListener(ev, (e) => { e.preventDefault(); dropEl.classList.remove("dragover"); }));
  dropEl.addEventListener("drop", (e) => {
    if (e.dataTransfer.files[0]) { fileEl.files = e.dataTransfer.files; showChosen(e.dataTransfer.files[0]); }
  });

  /* ---- Validation ---- */
  function validate(email, prompt, file) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!prompt || prompt.trim().length < 8) return "Add a short enhancement instruction (min 8 chars).";
    if (!file) return "Attach a CV file (.pdf, .docx or .txt).";
    if (!ACCEPT_EXT.includes(extOf(file.name))) return "Unsupported file type. Use .pdf, .docx or .txt.";
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File too large. Max ${MAX_FILE_MB} MB.`;
    return null;
  }

  /* ---- Submit ---- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const prompt = promptEl.value.trim();
    const file = fileEl.files[0];

    const err = validate(email, prompt, file);
    if (err) { setStatus("err", err); toast("err", "Check the form", err); return; }

    submit.disabled = true;
    submit.classList.add("loading");
    setStatus("info", "Uploading & processing…");

    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("prompt", prompt);
      fd.append("cv", file, file.name);   // field name "cv" matches multer on the backend

      const res = await fetch(API_ENDPOINT, { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Server responded ${res.status}`);
      }

      setStatus("ok", "Submitted! A notification email has been sent.");
      toast("ok", "Request received", "Your CV and prompt were processed and emailed for review.");
      form.reset();
      chosenEl.classList.remove("show");
    } catch (ex) {
      console.error(ex);
      const msg = /Failed to fetch/.test(ex.message)
        ? "Could not reach the backend. Is the server running?"
        : ex.message;
      setStatus("err", msg);
      toast("err", "Submission failed", msg);
    } finally {
      submit.disabled = false;
      submit.classList.remove("loading");
    }
  });
})();
