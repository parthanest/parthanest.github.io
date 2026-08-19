/* =========================================================================
   js/cv-form.js — CV Enhancer form handler
   -------------------------------------------------------------------------
   On submit: validate → POST multipart to the backend → the backend emails
   the owner the user details. Loading spinner + inline status + toast.
   The user NEVER sees raw server/network internals; every failure maps to a
   clean message. Real detail stays in the console only.
   ========================================================================= */

(function () {
  "use strict";

  // ✅ SAME-ORIGIN relative path. When deployed on Vercel, the /api function
  //    lives on the SAME domain as this page => no CORS, no mixed-content,
  //    no localhost problem. It "just works" once deployed.
  //    (For a local Express dev server instead, use the full URL.)
  const API_ENDPOINT = "/api/cv-enhance";
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

  function validate(email, prompt, file) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!prompt || prompt.trim().length < 8) return "Add a short enhancement instruction (min 8 chars).";
    if (!file) return "Attach a CV file (.pdf, .docx or .txt).";
    if (!ACCEPT_EXT.includes(extOf(file.name))) return "Unsupported file type. Use .pdf, .docx or .txt.";
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File too large. Max ${MAX_FILE_MB} MB.`;
    return null;
  }

  function friendlyError(kind) {
    switch (kind) {
      case "network": return "We couldn't reach the server. Please check your connection or try again shortly.";
      case "server":  return "The server couldn't process the request right now. Please try again in a moment.";
      default:        return "Something went wrong. Please try again.";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const prompt = promptEl.value.trim();
    const file = fileEl.files[0];

    const invalid = validate(email, prompt, file);
    if (invalid) { setStatus("err", invalid); toast("err", "Check the form", invalid); return; }

    submit.disabled = true;
    submit.classList.add("loading");
    setStatus("info", "Uploading & notifying…");

    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("prompt", prompt);
      fd.append("cv", file, file.name);   // field name "cv" matches the backend

      let res;
      try {
        res = await fetch(API_ENDPOINT, { method: "POST", body: fd });
      } catch (netErr) {
        console.error("[cv-form] network error:", netErr);   // console only
        throw { userKind: "network" };
      }
      if (!res.ok) { console.error("[cv-form] status:", res.status); throw { userKind: "server" }; }

      const data = await res.json().catch(() => ({}));
      if (!data.ok) { console.error("[cv-form] unexpected body"); throw { userKind: "server" }; }

      setStatus("ok", "Submitted! Your request has been emailed for review.");
      toast("ok", "Request received", "Your CV and prompt were sent successfully.");
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
