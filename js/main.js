/* =========================================================================
   js/main.js
   -------------------------------------------------------------------------
   Core interactions:
     - Theme toggle (dark/light, persisted)
     - Mobile navigation drawer
     - Scroll-spy active nav highlighting
     - Reveal-on-scroll entrance animations (IntersectionObserver)
     - Atmospheric floating particle field
   ========================================================================= */

(function () {
  "use strict";

  const root = document.documentElement;

  /* =======================================================
     THEME TOGGLE
     ======================================================= */
  const themeToggle = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeToggleLabel");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }

  let savedTheme = "dark";
  try {
    savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  } catch (e) {}
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* =======================================================
     MOBILE NAV DRAWER
     ======================================================= */
  const sidebar = document.getElementById("sidebar");
  const mobileNavToggle = document.getElementById("mobileNavToggle");

  if (mobileNavToggle && sidebar) {
    mobileNavToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
    });
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        mobileNavToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =======================================================
     SCROLL-SPY (active nav state)
     ======================================================= */
  function initScrollSpy() {
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav-link");
    if (!sections.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) =>
              link.classList.toggle("active", link.dataset.section === id)
            );
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* =======================================================
     REVEAL-ON-SCROLL entrance animations
     Applied to every .reveal element (sections + cards).
     ======================================================= */
  function initReveals() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* =======================================================
     ATMOSPHERIC PARTICLE FIELD
     Lightweight floating "air" particles behind the content.
     ======================================================= */
  function initParticles(count = 26) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const field = document.createElement("div");
    field.className = "particles";
    field.setAttribute("aria-hidden", "true");

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = 2 + Math.random() * 4;         // 2–6px
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.opacity = 0.3 + Math.random() * 0.5;
      p.style.animationDuration = 16 + Math.random() * 22 + "s"; // slow drift
      p.style.animationDelay = -(Math.random() * 30) + "s";      // desync start
      field.appendChild(p);
    }
    document.body.appendChild(field);
  }

  /* =======================================================
     BOOT
     Static parts run now; reveals/scroll-spy re-run after
     dynamic-content.js injects the cards.
     ======================================================= */
  function boot() {
    initScrollSpy();
    initReveals();
    initParticles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Re-scan once dynamic cards are rendered so they also animate in.
  document.addEventListener("content:rendered", () => {
    initReveals();
  });
})();
