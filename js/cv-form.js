/* =========================================================================
   js/cv-form.js — CV Enhancer form handler
   -------------------------------------------------------------------------
   - Validates email / prompt / file.
   - Sends multipart/form-data to the backend.
   - Loading spinner + inline status + toast.
   - IMPORTANT: the user NEVER sees raw server/network internals. Every
     failure is mapped to a clean, friendly message. Real details stay in
     the browser console only (console.error), never in the UI.
   ========================================================================= */

(function () {
  "use strict";

  // Point this at your deployed backend. Local dev default:
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

  /* ---- Toast ---- */
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
    el.innerHTML = `<span aria-hidden="true">${icon}</span><div><b>${title}</b><span>${msg}</span></div>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .4s, transform .4s";
      el.style.opacity = "0"; el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 420);
    }, 5200);
  }
  const setStatus = (kind, text) => { statusEl.className = "status " + kind; statusEl.textContent = text; };

  /* ---- File UX ---- */
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

  /* ---- Validation (these messages are safe + user-facing) ---- */
  function validate(email, prompt, file) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!prompt || prompt.trim().length < 8) return "Add a short enhancement instruction (min 8 chars).";
    if (!file) return "Attach a CV file (.pdf, .docx or .txt).";
    if (!ACCEPT_EXT.includes(extOf(file.name))) return "Unsupported file type. Use .pdf, .docx or .txt.";
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File too large. Max ${MAX_FILE_MB} MB.`;
    return null;
  }

  /* ---- Map ANY failure to a clean message (no internals leaked) ---- */
  function friendlyError(kind) {
    switch (kind) {
      case "network": return "We couldn't reach the server. Please check your connection or try again shortly.";
      case "server":  return "The server couldn't process the request right now. Please try again in a moment.";
      default:        return "Something went wrong. Please try again.";
    }
  }

  /* ---- Submit ---- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const prompt = promptEl.value.trim();
    const file = fileEl.files[0];

    const invalid = validate(email, prompt, file);
    if (invalid) { setStatus("err", invalid); toast("err", "Check the form", invalid); return; }

    submit.disabled = true;
    submit.classList.add("loading");
    setStatus("info", "Uploading & processing…");

    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("prompt", prompt);
      fd.append("cv", file, file.name);   // field name "cv" matches multer on the backend

      let res;
      try {
        res = await fetch(API_ENDPOINT, { method: "POST", body: fd });
      } catch (netErr) {
        // Covers Safari "Load failed", Chrome "Failed to fetch", DNS, CORS, offline, etc.
        console.error("[cv-form] network error:", netErr);      // stays in console only
        throw { userKind: "network" };
      }

      if (!res.ok) {
        console.error("[cv-form] server status:", res.status);  // console only
        throw { userKind: "server" };
      }

      // Backend returns a minimal, non-sensitive JSON: { ok: true }
      const data = await res.json().catch(() => ({}));
      if (!data.ok) { console.error("[cv-form] unexpected body"); throw { userKind: "server" }; }

      setStatus("ok", "Submitted! A confirmation email has been sent.");
      toast("ok", "Request received", "Your CV and prompt were processed and emailed for review.");
      form.reset();
      chosenEl.classList.remove("show");
    } catch (ex) {
      const msg = friendlyError(ex && ex.userKind);
      setStatus("err", msg);
      toast("err", "Submission failed", msg);
    } finally {
      submit.disabled = false;
      submit.classList.remove("loading");
    }
  });
})();
