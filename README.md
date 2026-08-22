# Parthasarathy T — Personal Portfolio (Static)

A **fully static**, premium personal portfolio for **GitHub Pages**. No build
step, no framework, no animation dependencies — it renders identically
everywhere. All content lives directly in `index.html`, and the styling is split
into **one CSS file per section** so you can edit any part in isolation.

---

## Folder Structure

```
/
├── index.html                    # All content lives here (static, always renders)
├── README.md
└── assets/
    ├── css/
    │   ├── 00-base.css            # Design tokens (colors/fonts/spacing) + reset
    │   ├── 01-nav.css             # Top nav + mobile menu + footer
    │   ├── 02-hero.css            # Hero section
    │   ├── 03-about.css           # About text + stats strip
    │   ├── 04-experience.css      # Experience timeline
    │   ├── 05-projects.css        # Project case-study cards
    │   ├── 06-skills.css          # Grouped skill cards
    │   ├── 07-credentials.css     # Certifications / Education / Publications
    │   └── 08-connect.css         # Closing LinkedIn CTA
    └── js/
        └── nav.js                 # ONLY script — mobile menu toggle
```

**Why this layout:** each visual section has its own CSS file. Want to restyle
the projects? Open `05-projects.css` and nothing else. Want to change the whole
color palette or fonts? Edit the tokens at the top of `00-base.css` — every
section inherits from there.

---

## How to Edit Content

All content is plain HTML in **`index.html`**, grouped under clearly labelled
`<section>` comments (`<!-- ===== PROJECTS ===== -->` etc.).

### Add a new project
Copy an existing `<article class="project"> … </article>` block inside
`<div class="projects">` and change the text:

```html
<article class="project">
  <div class="project__client">Client / Company Name</div>
  <h3 class="project__title">Project Title</h3>
  <div class="project__block">
    <span class="project__block-label">Challenge</span>
    <p>What problem needed solving.</p>
  </div>
  <div class="project__block">
    <span class="project__block-label">Approach</span>
    <p>What you did and how.</p>
  </div>
  <div class="project__block">
    <span class="project__block-label">Outcome</span>
    <p>The result / impact.</p>
  </div>
  <div class="project__tags">
    <span class="tag">GKE</span><span class="tag">Terraform</span>
  </div>
</article>
```

### Add a job
Copy a `<div class="tl-item"> … </div>` block inside `<div class="timeline">`.
Add `is-current` to the class (`<div class="tl-item is-current">`) and drop in a
`<span class="tl-item__badge">Current</span>` to mark your present role.

### Add a skill group
Copy a `<div class="skill-group"> … </div>` block inside `<div class="skills">`,
change the title and the `<span class="skill-chip">` chips.

### Add a certification / publication
Copy a `<div class="cred-item"> … </div>` or `<div class="pub-item"> … </div>`
block inside the `#certifications` section.

### Change name / tagline / LinkedIn
Edit the `#hero` section and the nav brand at the top of `index.html`. The
LinkedIn URL appears in three spots (nav, hero, connect) — update all three.

---

## Change the Look (design tokens)

Open **`assets/css/00-base.css`** and edit the `:root` variables. Everything
follows automatically:

```css
--gold:      #C9A96E;   /* accent */
--platinum:  #E8E3D9;
--bg-top:    #0A0E14;   /* gradient top */
--bg-bottom: #0D1420;   /* gradient bottom */
--font-head: "Playfair Display", serif;
--font-body: "Inter", sans-serif;
```

---

## Run Locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repo named `username.github.io`.
2. Commit all files at the repo **root** (so `index.html` is top-level).
3. Settings → Pages → Source: **Deploy from a branch** → `main` / root.
4. Visit `https://username.github.io`.

---

## Notes

- **Static-first:** content is in the HTML, so it renders even with JS/CSS
  partially blocked. The only script is the mobile menu toggle.
- **Premium, no animation:** hover states and gradients only — nothing that can
  break the layout on GitHub Pages.
- **Responsive:** mobile-first with a slide-down menu and stacked grids.
- **Fonts via CDN:** Google Fonts (Playfair Display + Inter). No other deps.
```
