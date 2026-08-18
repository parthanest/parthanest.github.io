/* =========================================================================
   js/dynamic-content.js
   -------------------------------------------------------------------------
   Reads the data/*.js files (exposed on window.PortfolioData) and renders
   the Expertise, Achievements, Projects and Stack sections into the DOM.
   You never edit this to add content — you only edit the data files.
   ========================================================================= */

(function () {
  "use strict";

  const data = window.PortfolioData || {};

  /* small helper: safe HTML escaping for text pulled from data files */
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  /* ---------------------------------------------------------------
     1) EXPERTISE cards  → #expertise-grid
     --------------------------------------------------------------- */
  function renderExpertise() {
    const grid = document.getElementById("expertise-grid");
    if (!grid || !data.expertise?.cards) return;

    grid.innerHTML = data.expertise.cards
      .map(
        (c) => `
        <div class="expertise-card glass">
          <span class="expertise-tag">${esc(c.tag)}</span>
          <h4>${esc(c.title)}</h4>
          <p>${esc(c.body)}</p>
        </div>`
      )
      .join("");
  }

  /* ---------------------------------------------------------------
     2) ACHIEVEMENTS  → metrics, certs, awards, publications
     --------------------------------------------------------------- */
  function renderAchievements() {
    const a = data.achievements;
    if (!a) return;

    const metrics = document.getElementById("metrics-grid");
    if (metrics && a.metrics) {
      metrics.innerHTML = a.metrics
        .map(
          (m) => `
          <div class="metric-tile glass">
            <div class="metric-value">${esc(m.value)}</div>
            <div class="metric-label">${esc(m.label)}</div>
          </div>`
        )
        .join("");
    }

    const certs = document.getElementById("cert-list");
    if (certs && a.certifications) {
      certs.innerHTML = a.certifications
        .map(
          (c) => `
          <div class="cert-item glass">
            <span class="ci-name">${esc(c.name)}</span>
            <span class="ci-meta">${esc(c.issuer)} · ${esc(c.date)}</span>
          </div>`
        )
        .join("");
    }

    const awards = document.getElementById("award-list");
    if (awards && a.awards) {
      awards.innerHTML = a.awards
        .map(
          (w) => `
          <div class="award-item glass">
            <span class="ai-name">${esc(w.name)}</span>
            <span class="ai-note">${esc(w.note)}</span>
          </div>`
        )
        .join("");
    }

    const pubs = document.getElementById("pub-list");
    if (pubs && a.publications) {
      pubs.innerHTML = a.publications
        .map(
          (p) => `
          <div class="pub-item glass">
            <span class="pi-name">${esc(p.name)}</span>
            <span class="pi-meta">${esc(p.venue)} · ${esc(p.date)}</span>
          </div>`
        )
        .join("");
    }
  }

  /* ---------------------------------------------------------------
     3) PROJECTS  → #projects-list
     --------------------------------------------------------------- */
  function renderProjects() {
    const list = document.getElementById("projects-list");
    if (!list || !data.projects) return;

    list.innerHTML = data.projects
      .map((p) => {
        const pipeline = (p.pipeline || [])
          .map(
            (s) =>
              `<span class="pipeline-chip">${esc(s.stage)}: ${esc(s.detail)}</span>`
          )
          .join("");

        const tech = (p.tech || [])
          .map((t) => `<span class="tech-tag">${esc(t)}</span>`)
          .join("");

        const links = p.links
          ? Object.entries(p.links)
              .map(
                ([label, url]) =>
                  `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`
              )
              .join("")
          : "";

        return `
        <article class="project-card glass">
          <div class="project-head">
            <h4>${esc(p.title)}</h4>
            <span class="project-domain">${esc(p.domain || "")}</span>
          </div>
          ${p.period ? `<div class="project-period">${esc(p.period)}</div>` : ""}
          <p class="project-desc">${esc(p.description)}</p>
          ${pipeline ? `<div class="project-pipeline">${pipeline}</div>` : ""}
          <div class="tag-row">${tech}</div>
          ${links ? `<div class="project-links">${links}</div>` : ""}
        </article>`;
      })
      .join("");
  }

  /* ---------------------------------------------------------------
     4) STACK groups  → #stack-groups
     --------------------------------------------------------------- */
  function renderStack() {
    const wrap = document.getElementById("stack-groups");
    if (!wrap || !data.expertise?.stack) return;

    wrap.innerHTML = data.expertise.stack
      .map(
        (g) => `
        <div class="stack-group">
          <h4 class="stack-group-title">${esc(g.group)}</h4>
          <div class="stack-chips">
            ${g.chips.map((c) => `<span>${esc(c)}</span>`).join("")}
          </div>
        </div>`
      )
      .join("");
  }

  /* ---------------------------------------------------------------
     Boot: render everything once the DOM is ready, then let main.js
     wire up the reveal-on-scroll observers over the fresh nodes.
     --------------------------------------------------------------- */
  function boot() {
    renderExpertise();
    renderAchievements();
    renderProjects();
    renderStack();
    // Notify main.js that dynamic content now exists in the DOM
    document.dispatchEvent(new CustomEvent("content:rendered"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
