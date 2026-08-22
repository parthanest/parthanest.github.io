# Parthasarathy T — Luxury Portfolio

## Run locally
Because project JSON is loaded with `fetch()`, do not open `index.html` directly from the filesystem.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Assets
Place the profile photograph at:

`assets/images/profile.jpg`

The design displays an elegant `PT` fallback if the image is missing.

## Add a project with zero core changes
Copy a project JSON file into `projects/` using the next contiguous number:

- Existing: `project-01.json`, `project-02.json`
- Add next: `project-03.json`

The loader checks sequentially and stops at the first missing file. Do not leave numbering gaps. This approach works on static hosts such as GitHub Pages because browsers cannot directly list a remote directory.

## Project schema
```json
{
  "number": "03",
  "sector": "Industry · Region",
  "title": "Concise engagement title",
  "summary": "Situation, scope and your ownership.",
  "impact": "Measurable result or strategic outcome.",
  "technologies": ["GCP", "Terraform", "GKE"]
}
```

## Deployment
Upload the repository root to GitHub Pages, Cloudflare Pages, Netlify, Vercel or any static web host. No build step is required.
