/* ============================================================================
 * main.js — Renderer + Animation Engine
 * ----------------------------------------------------------------------------
 * Responsibilities:
 *   1. Read window.PORTFOLIO_DATA (from data.js)
 *   2. Render every data-driven section into its container in index.html
 *   3. Wire nav, preloader, cursor glow, hero particle canvas
 *   4. Initialize GSAP ScrollTrigger animations AFTER render
 *
 * No framework, no build step. Runs directly on GitHub Pages via CDN <script>.
 * ==========================================================================*/

(function () {
  "use strict";

  const D = window.PORTFOLIO_DATA;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Tiny DOM helpers ------------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  // Escape user/data text before injecting into innerHTML.
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* =======================================================================
   * RENDER FUNCTIONS — one per data-driven section
   * =====================================================================*/

  function renderMeta() {
    const p = D.profile;
    document.title = `${p.name} — ${p.title}`;

    // Nav brand: last name gets a gold accent.
    const parts = p.name.trim().split(" ");
    const brandHTML = parts.length > 1
      ? `${esc(parts.slice(0, -1).join(" "))} <span>${esc(parts.slice(-1)[0])}</span>`
      : esc(p.name);
    $("#navBrand").innerHTML = brandHTML;
    $("#preloaderName").textContent = p.nickname || p.name;

    // Every LinkedIn CTA on the page.
    ["#navCta", "#connectCta"].forEach((id) => { $(id).href = p.linkedin; });
    $("#footerName").textContent = `© ${new Date().getFullYear()} ${p.name}`;
    $("#connectText").textContent =
      "LinkedIn is the best place to reach me — for a conversation, a connection, or just to say hello.";
  }

  function renderHero() {
    const p = D.profile;
    const parts = p.name.trim().split(" ");
    const nameHTML = parts.length > 1
      ? `${esc(parts.slice(0, -1).join(" "))}<br><em>${esc(parts.slice(-1)[0])}</em>`
      : esc(p.name);

    $("#heroInner").innerHTML = `
      <span class="hero__eyebrow hero-anim">Forward Deployed Engineer</span>
      <h1 class="hero__name hero-anim">${nameHTML}</h1>
      <p class="hero__title hero-anim">${esc(p.title)}</p>
      <p class="hero__subtitle hero-anim">${esc(p.subtitle)}</p>
      <p class="hero__tagline hero-anim">${esc(p.tagline)}</p>
      <div class="hero__meta hero-anim">
        <a class="hero__cta" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
        <span class="hero__location">${esc(p.location)}</span>
      </div>`;
  }

  function renderAbout() {
    const p = D.profile;
    $("#aboutBody").innerHTML = p.about.map((para) => `<p>${esc(para)}</p>`).join("");
    $("#statsStrip").innerHTML = p.stats.map((s) => `
      <div class="stat">
        <div class="stat__value">${esc(s.value)}</div>
        <div class="stat__label">${esc(s.label)}</div>
      </div>`).join("");
  }

  function renderExperience() {
    const wrap = $("#timeline");
    const progress = $("#timelineProgress");
    D.experience.forEach((job) => {
      const item = el("div", "tl-item reveal" + (job.current ? " is-current" : ""));
      item.innerHTML = `
        <div class="tl-item__head">
          <h3 class="tl-item__role">${esc(job.role)}${
            job.current ? '<span class="tl-item__badge">Current</span>' : ""
          }</h3>
          <span class="tl-item__period">${esc(job.period)}</span>
        </div>
        <div class="tl-item__company">${esc(job.company)}</div>
        <ul class="tl-item__points">
          ${job.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}
        </ul>`;
      wrap.appendChild(item);
    });
    // keep progress bar as last-known child reference
    wrap.appendChild(progress);
  }

  function renderProjects() {
    const grid = $("#projectsGrid");
    D.projects.forEach((proj) => {
      const card = el("article", "project reveal tilt");
      card.innerHTML = `
        <div class="project__glow" aria-hidden="true"></div>
        <div class="project__client">${esc(proj.client)}</div>
        <h3 class="project__title">${esc(proj.title)}</h3>
        <div class="project__block">
          <span class="project__block-label">Challenge</span>
          <p>${esc(proj.challenge)}</p>
        </div>
        <div class="project__block">
          <span class="project__block-label">Approach</span>
          <p>${esc(proj.approach)}</p>
        </div>
        <div class="project__block">
          <span class="project__block-label">Outcome</span>
          <p>${esc(proj.outcome)}</p>
        </div>
        <div class="project__tags">
          ${proj.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
        </div>`;
      grid.appendChild(card);
    });
  }

  function renderSkills() {
    const grid = $("#skillsGrid");
    Object.keys(D.skills).forEach((group) => {
      const g = el("div", "skill-group reveal tilt");
      g.innerHTML = `
        <h3 class="skill-group__title">${esc(group)}</h3>
        <div class="skill-group__items">
          ${D.skills[group].map((s) => `<span class="skill-chip">${esc(s)}</span>`).join("")}
        </div>`;
      grid.appendChild(g);
    });
  }

  function renderCreds() {
    $("#certsList").innerHTML = D.certifications.map((c) => `
      <div class="cred-item reveal">
        <span class="cred-item__name">${esc(c.name)}
          <span class="cred-item__sub">${esc(c.issuer)}</span>
        </span>
        <span class="cred-item__meta">${esc(c.date)}</span>
      </div>`).join("");

    $("#eduList").innerHTML = D.education.map((e) => `
      <div class="cred-item reveal">
        <span class="cred-item__name">${esc(e.degree)}
          <span class="cred-item__sub">${esc(e.school)} · ${esc(e.location)}</span>
        </span>
        <span class="cred-item__meta">${esc(e.period)}</span>
      </div>`).join("");

    $("#pubList").innerHTML = D.publications.map((pub) => {
      const inner = `
        <div class="pub-item__title">${esc(pub.title)}</div>
        <div class="pub-item__meta">${esc(pub.outlet)} · ${esc(pub.year)}</div>`;
      return `<div class="pub-item reveal">${
        pub.url
          ? `<a href="${esc(pub.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
          : inner
      }</div>`;
    }).join("");
  }

  /* =======================================================================
   * NAV — scroll state + mobile toggle
   * =====================================================================*/
  function initNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close mobile menu on link click.
    $(".nav__links").addEventListener("click", (e) => {
      if (e.target.classList.contains("nav__link")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =======================================================================
   * CURSOR GLOW — desktop pointer only
   * =====================================================================*/
  function initCursorGlow() {
    if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
    const glow = $("#cursorGlow");
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = "1"; }
    });
    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* =======================================================================
   * HERO CANVAS — lightweight particle field with cursor reactivity
   * =====================================================================*/
  function initHeroCanvas() {
    const canvas = $("#heroCanvas");
    if (!canvas) return;
    if (reduceMotion) return; // Static (CSS gradient) background is enough.

    const ctx = canvas.getContext("2d");
    let w, h, dpr, particles = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.4
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Cursor gentle attraction.
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) { p.x += dx * 0.0012; p.y += dy * 0.0012; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201,169,110,0.55)";
        ctx.fill();

        // Link nearby particles with faint gold lines.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(201,169,110,${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }

    const heroEl = $("#hero");
    heroEl.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    heroEl.addEventListener("mouseleave", () => { mouse.x = mouse.y = -9999; });

    size();
    frame();
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { cancelAnimationFrame(raf); size(); frame(); }, 200);
    });
  }

  /* =======================================================================
   * CARD TILT — subtle 3D hover (skips touch / reduced-motion)
   * =====================================================================*/
  function initTilt() {
    if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
    document.querySelectorAll(".tilt").forEach((card) => {
      const glow = card.querySelector(".project__glow");
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-4px)`;
        if (glow) {
          glow.style.left = e.clientX - r.left - 140 + "px";
          glow.style.top  = e.clientY - r.top  - 140 + "px";
        }
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* =======================================================================
   * PRELOADER — gold line draw, then reveal hero
   * =====================================================================*/
  function runPreloader(done) {
    const pre = $("#preloader");
    if (reduceMotion || typeof gsap === "undefined") {
      pre.style.display = "none"; done(); return;
    }
    const tl = gsap.timeline({ onComplete: () => { pre.classList.add("is-done"); done(); } });
    tl.to("#preloader .preloader__line", { width: 220, duration: 0.9, ease: "power2.inOut" })
      .to("#preloaderName", { opacity: 1, duration: 0.5 }, "-=0.4")
      .to("#preloader", { opacity: 0, duration: 0.6, delay: 0.35 })
      .set("#preloader", { display: "none" });
  }

  /* =======================================================================
   * SCROLL ANIMATIONS — GSAP ScrollTrigger (graceful fallback)
   * =====================================================================*/
  function initAnimations() {
    // Fallback: if GSAP missing or reduced motion, just show everything.
    if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-visible"));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro sequence.
    gsap.from(".hero-anim", {
      y: 34, opacity: 0, duration: 1, ease: "power3.out",
      stagger: 0.12, delay: 0.15
    });

    // Generic reveals (staggered when siblings share a parent grid).
    gsap.utils.toArray(".reveal").forEach((node) => {
      gsap.fromTo(node, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 88%", once: true }
      });
      node.classList.add("is-visible");
    });

    // Staggered grids for cards.
    [".projects", ".skills"].forEach((sel) => {
      const parent = $(sel);
      if (!parent) return;
      gsap.fromTo(parent.children, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: parent, start: "top 85%", once: true }
      });
    });

    // Timeline progress line draws in sync with scroll.
    const timeline = $("#timeline");
    const progress = $("#timelineProgress");
    if (timeline && progress) {
      gsap.to(progress, {
        height: () => timeline.offsetHeight - 12,
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.6
        }
      });
    }

    ScrollTrigger.refresh();
  }

  /* =======================================================================
   * BOOT
   * =====================================================================*/
  function boot() {
    // 1) Render everything from data.js
    renderMeta();
    renderHero();
    renderAbout();
    renderExperience();
    renderProjects();
    renderSkills();
    renderCreds();

    // 2) Wire interactions
    initNav();
    initCursorGlow();
    initHeroCanvas();
    initTilt();

    // 3) Preloader -> then animations (after DOM is fully painted)
    runPreloader(() => initAnimations());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
