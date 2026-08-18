# parthanest.github.io

A modular, data-driven, futuristic personal portfolio for **Parthasarathy T** — Forward-Deployed Engineer (GCP · DevOps · MLOps) — now with an **AI Tools** rail featuring an automated **CV Enhancer** powered by GitHub Actions + Gemini.

## ✨ Features

- **Dark futuristic theme** — glassmorphism, glowing rings, animated tagline, atmospheric particles.
- **Fully data-driven** content in `data/*.js`.
- **AI Tools rail** — a right-hand column hosting the CV Enhancer (email + prompt + file upload, loading states, toast notifications).
- **CI/CD automation** — the form fires a `repository_dispatch` event that runs a GitHub Actions pipeline calling Gemini.

## 📁 Structure

```
portfolio/
├── index.html
├── css/
│   ├── main.css              # tokens, reset, layout (leaves room for AI rail)
│   ├── animations.css        # keyframes: ring, particles, spinner, toast
│   ├── components.css        # sidebar, cards, chips
│   └── ai-tools.css          # AI rail, CV form, dropzone, toasts   ← NEW
├── js/
│   ├── main.js               # theme, nav, scroll-spy, reveals, particles
│   ├── dynamic-content.js    # renders sections from data files
│   └── cv-enhancer.js        # form handler + repository_dispatch    ← NEW
├── data/
│   ├── expertise.js
│   ├── achievements.js
│   └── projects.js
├── assets/images/profile.png
├── .github/workflows/
│   └── cv-enhancer.yml        # Actions pipeline (Gemini)            ← NEW
└── scripts/
    ├── process_cv.py          # Gemini CV rewriter                  ← NEW
    └── cv-enhancer-proxy.worker.js  # optional secure token proxy   ← NEW
```

## 🤖 CV Enhancer — setup

### 1. Repository secrets
`Settings → Secrets and variables → Actions`:

| Secret | Purpose |
|---|---|
| `LLM_API_KEY` | Your **Gemini API key** (mapped to `GEMINI_API_KEY` in the workflow). |
| `GH_PAT` | Fine-grained PAT used by the **dispatcher** (proxy/front-end), *not* the workflow. Scope: `Contents: Read/Write` + `Metadata: Read` on this repo only. |

### 2. Token handling — pick a mode in `js/cv-enhancer.js`

> ⚠️ **A PAT in front-end JS is public.** Never commit a real token to a public GitHub Pages site.

- **`mode: "proxy"` (recommended, default).** Deploy `scripts/cv-enhancer-proxy.worker.js` as a Cloudflare Worker (or Vercel/Netlify/Cloud Run function). It stores `GH_PAT` as a server secret and forwards the dispatch. Set `proxyEndpoint` to its URL.
- **`mode: "direct"` (dev / private repo only).** Calls GitHub directly with a throwaway fine-grained token. For local testing only.

### 3. Flow

```
Browser form ──base64──▶ repository_dispatch ("cv-enhancer-request")
        │                         │
        └─(proxy holds GH_PAT)    ▼
                        GitHub Actions: cv-enhancer.yml
                          → decode file
                          → scripts/process_cv.py  (GEMINI_API_KEY = LLM_API_KEY)
                          → Gemini rewrites CV
                          → upload "enhanced-cv" artifact
                          → run-result email to your GitHub account
```

## 🚀 Deploy

Push to `parthanest.github.io` repo root → **Settings → Pages → Source: main/root**.
The static site needs no build. The Action runs on GitHub's runners.

## 🖼️ Profile photo

Replace `assets/images/profile.png` with your own — `object-fit: cover` keeps it circular.
