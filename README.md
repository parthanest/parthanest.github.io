# parthanest.github.io

Modular portfolio for **Parthasarathy T** with a working **CV Enhancer** AI tool —
a static frontend (GitHub Pages) plus a lightweight **Node.js/Express** backend that
parses the upload and sends a **Gmail SMTP** notification.

## 📁 Structure

```
portfolio/
├── index.html                 # landing page (bio + projects + AI Tools button)
├── cv-enhancer.html           # AI Tools → interactive CV Enhancer form
├── .env.example               # backend env vars (copy → server/.env)
├── .gitignore
├── css/  { main, components, ai-tools }.css
├── js/
│   ├── main.js                # registry + theme/nav/reveals
│   ├── dynamic-content.js     # renders profile + projects
│   └── cv-form.js             # CV form handler (multipart POST)   ← NEW
├── data/  about-me.js + projects/project-N.js
├── server/                    # ← NEW backend
│   ├── server.js              # Express + multer endpoint
│   ├── mailer.js              # nodemailer Gmail SMTP utility
│   └── package.json
└── .github/workflows/cv-enhancer.yml   # backend CI (install + syntax check)
```

## 🔀 How it works

```
cv-enhancer.html  ──(multipart: email, prompt, cv file)──▶  POST /api/cv-enhance
   js/cv-form.js                                              server/server.js
                                                                │ multer parses file
                                                                │ (optional LLM step)
                                                                ▼
                                                        server/mailer.js
                                                        nodemailer → Gmail SMTP
                                                        ✉️  parthadevop@gmail.com
```

## 🚀 Run the backend locally

```bash
cd server
npm install
cp ../.env.example .env      # then fill in GMAIL_APP_PASSWORD etc.
npm start                    # → http://localhost:8080
```

Point the frontend at it: in `js/cv-form.js` set
`API_ENDPOINT = "http://localhost:8080/api/cv-enhance"` (already the default),
then open `cv-enhancer.html`.

## 🔐 Gmail App Password (required)

Gmail SMTP will **not** accept your normal password. You need an **App Password**:

1. Enable **2-Step Verification** on `parthadevop@gmail.com`.
2. Google Account → **Security → App passwords** → generate one (16 chars).
3. Put it in `server/.env` as `GMAIL_APP_PASSWORD` (or as a host secret in
   Render/Railway/Cloud Run). **Never commit it** — `.env` is git-ignored.

| Env var | Purpose |
|---|---|
| `GMAIL_USER` | Sender address (`parthadevop@gmail.com`). |
| `GMAIL_APP_PASSWORD` | 16-char Google App Password. |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.gmail.com` / `587` (STARTTLS) or `465` (SSL). |
| `NOTIFY_TO` | Inbox that receives the notifications. |
| `ALLOWED_ORIGINS` | Front-end origins allowed by CORS. |

## ☁️ Deploy notes

- **Frontend**: push to `parthanest.github.io` → Pages → `main`/root.
- **Backend**: deploy `server/` to Render / Railway / Cloud Run (set the env
  vars there), then update `API_ENDPOINT` in `js/cv-form.js` to the public URL.
- GitHub Pages is static-only, so the backend must be hosted separately.
