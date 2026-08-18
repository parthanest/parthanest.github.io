# parthanest.github.io

A modular, data-driven, futuristic personal portfolio for **Parthasarathy T** — Forward-Deployed Engineer (GCP · DevOps · MLOps).

## ✨ What's inside

- **Dark, futuristic theme** — glassmorphism, glowing borders, animated gradient tagline, atmospheric floating particles.
- **Circular profile photo** with a rotating conic-gradient ring + breathing pulse glow.
- **Fully data-driven** — all content lives in `data/*.js`. Add a project/skill/award by editing a data file; the UI updates itself.
- **Scroll-triggered reveals** (IntersectionObserver), scroll-spy nav, dark/light toggle, and a mobile drawer.
- **Accessible** — respects `prefers-reduced-motion`, semantic landmarks, ARIA labels.

## 📁 Structure

```
portfolio/
├── index.html                 # Landing structure (semantic shell only)
├── css/
│   ├── main.css               # Tokens (CSS variables), reset, layout, buttons
│   ├── animations.css         # Keyframes: ring pulse/spin, particles, reveals
│   └── components.css         # Sidebar, cards, chips, glass panels
├── js/
│   ├── main.js                # Theme, mobile nav, scroll-spy, reveals, particles
│   └── dynamic-content.js     # Renders sections from the data files
├── data/
│   ├── expertise.js           # Expertise cards + full grouped tech stack
│   ├── achievements.js        # Metrics, certifications, awards, publications
│   └── projects.js            # Project cards (title, tech, highlights)
└── assets/
    └── images/
        └── profile.png        # Your profile picture (placeholder included)
```

## 🚀 Deploy to GitHub Pages

1. Push these files to your `parthanest.github.io` repo root.
2. **Settings → Pages → Source: `main` / root.**
3. Visit `https://parthanest.github.io`.

> No build step, no dependencies — pure HTML/CSS/JS, works directly on Pages.

## 🖊️ How to update content (no HTML edits)

| To change… | Edit… |
|---|---|
| Projects | `data/projects.js` |
| Skills / stack / expertise cards | `data/expertise.js` |
| Certifications, awards, metrics, publications | `data/achievements.js` |
| About / hero copy | `index.html` (About & Hero sections only) |
| Colors / fonts / glow | CSS variables at the top of `css/main.css` |

## 🖼️ Profile photo

Replace `assets/images/profile.png` with your own square-ish photo (any aspect ratio works —
`object-fit: cover` keeps it perfectly circular). The included file is a placeholder.
