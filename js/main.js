/* =========================================================================
   js/main.js
   -------------------------------------------------------------------------
   - Provides the project registry (window.registerProject) that each
     data/projects/project-N.js file calls to self-register.
   - Handles theme toggle, mobile nav, scroll-spy and reveal animations.
   ========================================================================= */

(function () {
  "use strict";

  /* ---- Project registry ---------------------------------------------
     Each project file calls window.registerProject({...}). We collect
     them here so dynamic-content.js can render them (sorted by order).   */
  window.PortfolioData = window.PortfolioData || {};
  window.PortfolioData.projects = window.PortfolioData.projects || [];
  window.registerProject = function (project) {
    window.PortfolioData.projects.push(project);
  };

  const root = document.documentElement;

  /* ---- Theme toggle (persisted) ---- */
  function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const label = document.getElementById("themeToggleLabel");
    const apply = (t) => {
      root.setAttribute("data-theme", t);
      if (label) label.textContent = t === "dark" ? "Dark" : "Light";
      try { localStorage.setItem("theme", t); } catch (e) {}
    };
    let saved = "dark";
    try {
      saved = localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    } catch (e) {}
    apply(saved);
    if (toggle) toggle.addEventListener("click", () =>
      apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));
  }

  /* ---- Mobile nav drawer ---- */
  function initMobileNav() {
    const sidebar = document.getElementById("sidebar");
    const toggle = document.getElementById("mobileNavToggle");
    if (!sidebar || !toggle) return;
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.querySelectorAll(".nav-link").forEach((link) =>
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }));
  }

  /* ---- Scroll-spy: highlight active nav item ---- */
  function initScrollSpy() {
    const sections = document.querySelectorAll(".section");
    const links = document.querySelectorAll(".nav-link");
    if (!sections.length) return;
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.getAttribute("id");
          links.forEach((l) => l.classList.toggle("active", l.dataset.section === id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Reveal-on-scroll entrance animations ---- */
  function initReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  function boot() { initTheme(); initMobileNav(); initScrollSpy(); initReveals(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Re-scan reveals after dynamic cards are injected.
  document.addEventListener("content:rendered", initReveals);
})();
