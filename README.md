# parthanest.github.io

Modular portfolio for **Parthasarathy T** with a working **CV Enhancer** AI tool —
static frontend (GitHub Pages) + a lightweight **Node.js/Express** backend that parses
the upload and sends a **Gmail SMTP** notification.

## 📁 Structure

```
portfolio/
├── index.html                 # landing page (bio + projects + AI Tools button)
├── cv-enhancer.html           # SELF-CONTAINED tool page (styles inlined)
├── .env.example  .gitignore
├── css/  { main, components, ai-tools }.css
├── js/   { main, dynamic-content, cv-form }.js
├── data/ about-me.js + projects/project-N.js
├── server/  { server.js, mailer.js, package.json }
└── .github/workflows/cv-enhancer.yml
```

## ⚠️ Why the tool page is self-contained
`cv-enhancer.html` inlines its CSS on purpose. Earlier it rendered unstyled because
external CSS didn't load (wrong path / preview / offline). Inlining guarantees it
**always renders correctly**, no matter how it's opened.

## 🔐 Error & log privacy
The client **never** sees server internals. All backend failures are logged
server-side only (`console.error` with a short `ref` id); the browser gets a clean,
generic message. The frontend also maps every network error (Safari "Load failed",
Chrome "Failed to fetch", CORS, offline) to a friendly line.

## ▶️ Run the backend
```bash
cd server
npm install
cp ../.env.example .env        # fill in GMAIL_APP_PASSWORD
npm start                      # → http://localhost:8080
```
Open `cv-enhancer.html` locally (localhost → localhost is allowed).

## ☁️ Deploy
GitHub Pages is static-only, so host `server/` on **Render / Railway / Cloud Run**,
set the env vars there (incl. `GMAIL_APP_PASSWORD`), then update `API_ENDPOINT`
in `js/cv-form.js` to the public HTTPS URL. This also avoids the mixed-content
block you hit when an HTTPS page calls `http://localhost`.

## 🔑 Gmail App Password
Gmail SMTP rejects your normal password. Enable 2-Step Verification on
`parthadevop@gmail.com`, generate a 16-char **App Password**, and store it as
`GMAIL_APP_PASSWORD` on the backend host (never commit it).
