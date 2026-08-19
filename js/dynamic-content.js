/* js/dynamic-content.js — paints sidebar profile, About, and Projects feed. */
(function () {
  "use strict";
  const data = window.PortfolioData || {};
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
  const setHTML = (id, h) => { const el = document.getElementById(id); if (el) el.innerHTML = h; };

  function renderAbout() {
    const a = data.about;
    if (!a) return;
    setText("profileName", a.name);
    setText("profileStatus", a.status);
    setText("profileMeta", `${a.location} · ${a.badge}`);
    setText("aboutTagline", a.tagline);
    setText("aboutBio", a.bio);
    setText("contactEmail", a.email);
    const emailBtn = document.getElementById("contactEmailBtn");
    if (emailBtn) emailBtn.href = "mailto:" + a.email;
    setHTML("socialShort", (a.socials || []).map((s) =>
      `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${esc(s.short)}</a>`).join(""));
    setHTML("socialFull", (a.socials || []).map((s) =>
      `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(""));
  }

  function renderProjects() {
    const list = document.getElementById("projects-list");
    if (!list || !data.projects) return;
    const projects = data.projects.slice().sort((x, y) => (x.order || 99) - (y.order || 99));
    list.innerHTML = projects.map((p) => {
      const tech = (p.tech || []).map((t) => `<span class="tech-tag">${esc(t)}</span>`).join("");
      const links = p.links
        ? Object.entries(p.links).map(([label, url]) =>
            `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`).join("")
        : "";
      return `
        <article class="project-card glass">
          <div class="project-head">
            <h4>${esc(p.title)}</h4>
            <span class="project-domain">${esc(p.domain || "")}</span>
          </div>
          ${p.period ? `<div class="project-period">${esc(p.period)}</div>` : ""}
          <p class="project-desc">${esc(p.description)}</p>
          <div class="tag-row">${tech}</div>
          ${links ? `<div class="project-links">${links}</div>` : ""}
        </article>`;
    }).join("");
  }

  function boot() {
    renderAbout();
    renderProjects();
    document.dispatchEvent(new CustomEvent("content:rendered"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
