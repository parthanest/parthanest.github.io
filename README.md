# parthanest.github.io — Portfolio + CV Enhancer

Modular portfolio with an **email-on-submit CV Enhancer**. When a user submits the
form, a **same-origin Vercel serverless function** emails **you** (`parthadevop@gmail.com`)
the user's details with the CV attached.

## 🔔 What happens on submit

```
cv-enhancer.html ──(multipart: email, prompt, cv file)──▶ POST /api/cv-enhance
   js/cv-form.js                                            api/cv-enhance.js
                                                              │ busboy parses upload
                                                              │ nodemailer → Gmail SMTP
                                                              ▼
                                                    ✉️  Email to parthadevop@gmail.com
                                                        (user email + prompt + CV attached)
   browser gets: { ok: true }
```

## 📁 Structure

```
portfolio/
├── index.html                 # landing page (AI Tools button)
├── cv-enhancer.html           # self-contained tool page (styles inlined)
├── api/cv-enhance.js          # ← serverless backend: emails you on submit
├── vercel.json                # function config
├── package.json               # busboy + nodemailer
├── .env.example  .gitignore
├── css/  { main, components, ai-tools }.css
├── js/   { main, dynamic-content, cv-form }.js
└── data/ about-me.js + projects/project-N.js
```

## 🚀 Deploy (Vercel — recommended, same-origin)

1. Push this folder to a GitHub repo.
2. On **vercel.com** → **New Project** → import the repo.
3. **Settings → Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `GMAIL_USER` | `parthadevop@gmail.com` |
   | `GMAIL_APP_PASSWORD` | your 16-char Google App Password |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `NOTIFY_TO` | `parthadevop@gmail.com` |
4. **Deploy.** Your site + `/api/cv-enhance` are now on one HTTPS domain —
   the form works with no CORS / mixed-content / localhost issues.

Local run: `npm i -g vercel` → `cp .env.example .env` (fill it) → `vercel dev`.

## 🔑 Gmail App Password (required)
Gmail SMTP rejects your normal password. Enable **2-Step Verification** on
`parthadevop@gmail.com`, then Google Account → Security → **App passwords** →
generate a 16-char password → store as `GMAIL_APP_PASSWORD`. Never commit it.

## 🔐 Privacy of errors/logs
The client only ever receives `{ ok:true }` or a generic message. All real errors
(SMTP failures, stack traces, connection details) are logged **server-side only**
in Vercel logs with a short `ref` id — never exposed in the frontend.
