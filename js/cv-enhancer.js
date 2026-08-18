/* =========================================================================
   js/cv-enhancer.js
   -------------------------------------------------------------------------
   Handles the "CV Enhancer" form in the AI Tools rail:
     1. Validates email / prompt / file.
     2. Base64-encodes the uploaded CV.
     3. Fires a GitHub `repository_dispatch` event
          event_type   : "cv-enhancer-request"
          client_payload: { filename, content_base64, prompt, email }
     4. Shows loading, success and error states (inline + toast).

   ------------------------------------------------------------------------
   ⚠️  SECURITY — READ THIS
   ------------------------------------------------------------------------
   GitHub's repository_dispatch API requires an Authorization token.
   A token placed in front-end JS is PUBLIC — anyone can read it in your
   site source and abuse it. There are two supported modes below:

   • MODE "proxy"  (RECOMMENDED, default):
       The browser POSTs to YOUR serverless function (Cloudflare Worker,
       Vercel/Netlify function, Cloud Run, etc.). That function holds the
       GH_PAT as a server-side secret and forwards the dispatch to GitHub.
       No token ever reaches the browser.

   • MODE "direct" (DEV / PRIVATE-REPO ONLY):
       The browser calls GitHub directly with a fine-grained PAT.
       Only ever use this for local testing or a throwaway token with the
       single "Contents: read/write + Metadata" permission on ONE repo.
       NEVER commit a real token to a public GitHub Pages site.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================
     CONFIG  — edit these values (or inject at build time)
     ======================================================= */
  const CVE_CONFIG = {
    // "proxy" (recommended) or "direct" (dev only)
    mode: "proxy",

    // GitHub repo that owns the Action workflow
    owner: "parthanest",
    repo: "parthanest.github.io",

    // event type the workflow listens for
    eventType: "cv-enhancer-request",

    // --- proxy mode ---
    // Your serverless endpoint that injects GH_PAT server-side and
    // forwards the dispatch to GitHub. See scripts/README or the workflow docs.
    proxyEndpoint: "https://<your-worker-subdomain>.workers.dev/cv-enhancer",

    // --- direct mode (DEV ONLY) ---
    // Leave EMPTY on any public site. Only set at runtime for local testing.
    directToken: "",

    // upload constraints
    maxFileMB: 5,
    acceptExt: [".pdf", ".docx", ".txt"]
  };

  /* =======================================================
     DOM refs
     ======================================================= */
  const form      = document.getElementById("cvForm");
  if (!form) return; // rail not on the page

  const emailEl   = document.getElementById("cvEmail");
  const promptEl  = document.getElementById("cvPrompt");
  const fileEl    = document.getElementById("cvFile");
  const dropEl    = document.getElementById("cvDrop");
  const chosenEl  = document.getElementById("cvFileChosen");
  const submitBtn = document.getElementById("cvSubmit");
  const statusEl  = document.getElementById("cvStatus");

  /* =======================================================
     Toast helper
     ======================================================= */
  function ensureToastWrap() {
    let w = document.querySelector(".toast-wrap");
    if (!w) {
      w = document.createElement("div");
      w.className = "toast-wrap";
      w.setAttribute("aria-live", "polite");
      document.body.appendChild(w);
    }
    return w;
  }
  function toast(kind, title, msg) {
    const wrap = ensureToastWrap();
    const el = document.createElement("div");
    el.className = "toast " + (kind === "ok" ? "ok" : kind === "err" ? "err" : "");
    const icon = kind === "ok" ? "✅" : kind === "err" ? "⛔" : "ℹ️";
    el.innerHTML =
      `<span class="toast-icon">${icon}</span>
       <div class="toast-body"><strong>${title}</strong><span>${msg}</span></div>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .4s, transform .4s";
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 420);
    }, 5200);
  }

  function setStatus(kind, text) {
    statusEl.className = "cv-status " + kind;
    statusEl.textContent = text;
  }

  /* =======================================================
     File selection UX (click + drag/drop + label)
     ======================================================= */
  function extOf(name) { return name.slice(name.lastIndexOf(".")).toLowerCase(); }

  function showChosen(file) {
    chosenEl.classList.add("show");
    const kb = (file.size / 1024).toFixed(0);
    chosenEl.innerHTML = `📄 ${file.name} <span style="color:var(--text-muted)">(${kb} KB)</span>`;
  }

  fileEl.addEventListener("change", () => {
    if (fileEl.files[0]) showChosen(fileEl.files[0]);
  });
  ["dragenter", "dragover"].forEach((ev) =>
    dropEl.addEventListener(ev, (e) => { e.preventDefault(); dropEl.classList.add("dragover"); })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dropEl.addEventListener(ev, (e) => { e.preventDefault(); dropEl.classList.remove("dragover"); })
  );
  dropEl.addEventListener("drop", (e) => {
    if (e.dataTransfer.files[0]) {
      fileEl.files = e.dataTransfer.files;
      showChosen(e.dataTransfer.files[0]);
    }
  });

  /* =======================================================
     Encode file → base64 (strips the data: URL prefix)
     ======================================================= */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  /* =======================================================
     Validation
     ======================================================= */
  function validate(email, prompt, file) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address.";
    if (!prompt || prompt.trim().length < 8)
      return "Add a short enhancement instruction (min 8 chars).";
    if (!file)
      return "Attach a CV file (.pdf, .docx or .txt).";
    if (!CVE_CONFIG.acceptExt.includes(extOf(file.name)))
      return "Unsupported file type. Use .pdf, .docx or .txt.";
    if (file.size > CVE_CONFIG.maxFileMB * 1024 * 1024)
      return `File too large. Max ${CVE_CONFIG.maxFileMB} MB.`;
    return null;
  }

  /* =======================================================
     Dispatch — proxy mode (recommended)
     ======================================================= */
  async function dispatchViaProxy(payload) {
    const res = await fetch(CVE_CONFIG.proxyEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: CVE_CONFIG.eventType,
        client_payload: payload
      })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Proxy responded ${res.status}. ${t}`.trim());
    }
    return true;
  }

  /* =======================================================
     Dispatch — direct mode (DEV ONLY)
     ======================================================= */
  async function dispatchDirect(payload) {
    if (!CVE_CONFIG.directToken) {
      throw new Error("Direct mode needs a token — use proxy mode on public sites.");
    }
    const url = `https://api.github.com/repos/${CVE_CONFIG.owner}/${CVE_CONFIG.repo}/dispatches`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${CVE_CONFIG.directToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type: CVE_CONFIG.eventType,
        client_payload: payload
      })
    });
    // GitHub returns 204 No Content on success
    if (res.status !== 204) {
      const t = await res.text().catch(() => "");
      throw new Error(`GitHub responded ${res.status}. ${t}`.trim());
    }
    return true;
  }

  /* =======================================================
     Submit handler
     ======================================================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email  = emailEl.value.trim();
    const prompt = promptEl.value.trim();
    const file   = fileEl.files[0];

    const err = validate(email, prompt, file);
    if (err) { setStatus("err", err); toast("err", "Check the form", err); return; }

    // loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    setStatus("info", "Encoding file & dispatching pipeline…");

    try {
      const content_base64 = await fileToBase64(file);
      const payload = {
        filename: file.name,
        content_base64,
        prompt,
        email,
        submitted_at: new Date().toISOString()
      };

      if (CVE_CONFIG.mode === "direct") {
        await dispatchDirect(payload);
      } else {
        await dispatchViaProxy(payload);
      }

      setStatus("ok", "Pipeline triggered! You'll get an email when it's done.");
      toast("ok", "CV Enhancer started",
        "GitHub Actions is processing your CV. The enhanced version will be attached to the run and emailed to your GitHub account.");
      form.reset();
      chosenEl.classList.remove("show");
    } catch (ex) {
      console.error(ex);
      setStatus("err", ex.message || "Something went wrong.");
      toast("err", "Trigger failed", ex.message || "Could not start the pipeline.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });

  /* =======================================================
     Mobile: open/close the AI rail as a drawer
     ======================================================= */
  const rail = document.getElementById("aiRail");
  const fab  = document.getElementById("aiFab");
  if (rail && fab) {
    fab.addEventListener("click", () => rail.classList.toggle("open"));
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 1200 && rail.classList.contains("open")
          && !rail.contains(e.target) && e.target !== fab) {
        rail.classList.remove("open");
      }
    });
  }
})();
