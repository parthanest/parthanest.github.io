# Parthasarathy T — Personal Portfolio

A static, dependency-free personal portfolio built for **GitHub Pages**. Dark,
minimalist, luxury aesthetic — Playfair Display + Inter, gold hairlines, glass
surfaces, GSAP scroll animations, and a cursor-reactive particle hero.

No React. No Vite. No build step. It runs **as-is** from a plain repo — GSAP and
Google Fonts load via CDN.

---

## Folder Structure

```
/
├── index.html                 # Shell only — empty section containers with IDs
├── README.md                  # You are here
└── assets/
    ├── css/
    │   └── styles.css          # Full design system + responsive + reduced-motion
    ├── js/
    │   ├── data.js             # ⭐ SINGLE SOURCE OF TRUTH — all content lives here
    │   └── main.js             # Renders data.js into the DOM, then runs animations
    └── img/                    # (optional) images / og image / favicon
```

**Key principle:** `index.html` holds only empty containers. Every repeatable
section (experience, projects, skills, certs, education, publications) is
**rendered from `data.js`** by `main.js` on page load. To change content you
edit **one file**: `assets/js/data.js`.

---

## Run Locally

Because scripts load via relative paths, open it through a tiny local server
(not `file://`, which can block some browsers):

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

Or just push to GitHub and enable Pages.

---

## Deploy to GitHub Pages

1. Create a repo named `username.github.io` (replace with your GitHub username).
2. Commit all files at the repo **root** (so `index.html` sits at the top level).
3. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick `main` / root.
4. Visit `https://username.github.io`.

---

## ⭐ How to Add a New Project (future-me, read this)

Open **`assets/js/data.js`** and append **one object** to the `projects` array.
Nothing else changes — no HTML, no CSS, no JS.

```js
const projects = [
  // ...existing projects...
  {
    title: "My New Project Title",
    client: "Client or Company Name",        // shows as the gold eyebrow
    challenge: "What problem needed solving.",
    approach:  "What I did and how.",
    outcome:   "The measurable result / impact.",
    tags: ["GKE", "Terraform", "ArgoCD"]      // render as chips
  }
];
```

Save, commit, push. The new card appears automatically, styled and animated,
in the order it sits in the array (top of the array = first on the page).

---

## Adding Other Content (same pattern, same file)

All of these live in `assets/js/data.js`:

| To add / change...        | Edit this in `data.js`        | Notes                                            |
|---------------------------|-------------------------------|--------------------------------------------------|
| A job                     | `experience[]`                | Most recent first. `current: true` adds a badge. |
| A skill **group**         | add a key to `skills{}`       | Key = group title, value = array of skills.      |
| A skill inside a group    | push into that group's array  | e.g. `skills["CI/CD"].push("CircleCI")`          |
| A certification           | `certifications[]`            | Most recent first.                               |
| Education                 | `education[]`                 |                                                  |
| A publication / article   | `publications[]`              | Set `url` to make the title a link.              |
| Name / title / tagline    | `profile{}`                   | Also updates the browser tab + nav brand.        |
| Hero stats strip          | `profile.stats[]`             | Four items look best.                            |
| About paragraphs          | `profile.about[]`             | Each string becomes its own `<p>`.               |
| LinkedIn URL (only CTA)   | `profile.linkedin`            | Updates every CTA on the page at once.           |

---

## Design Tokens (edit once, applies everywhere)

Colors, fonts, and spacing are CSS custom properties at the top of
`assets/css/styles.css` under `:root`. Change the accent gold, background
gradient, or fonts there and the whole site follows.

```css
--gold:     #C9A96E;
--platinum: #E8E3D9;
--bg-top:   #0A0E14;
--bg-bottom:#0D1420;
```

---

## Accessibility & Performance

- **`prefers-reduced-motion`** fully respected — particle canvas, tilt, cursor
  glow, and scroll animations all disable, and content shows immediately.
- Semantic landmarks (`header`, `main`, `footer`, `nav`) and `aria` labels.
- Mobile-first responsive with a slide-down mobile menu.
- No layout thrash: canvas is throttled, resize is debounced, animations are
  GPU-friendly transforms.
- Zero runtime dependencies beyond GSAP (CDN) — no framework, no bundler.

---

## Tech

- **HTML/CSS/JS** (vanilla) — no framework, no build.
- **GSAP + ScrollTrigger** (CDN) — scroll reveals + timeline draw.
- **Google Fonts** — Playfair Display + Inter.

If GSAP fails to load for any reason, the site gracefully falls back to fully
visible, static content.
