"use strict";
const CONFIG = { projectPath: "projects", prefix: "project-", extension: ".json", start: 1, max: 100, pad: 2 };

const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

async function loadProjects() {
  const grid = document.querySelector("#project-grid");
  const status = document.querySelector("#project-status");
  let loaded = 0;

  // Static hosts cannot list folders. We fetch contiguous files in sequence and stop at the first 404.
  for (let index = CONFIG.start; index <= CONFIG.max; index += 1) {
    const id = String(index).padStart(CONFIG.pad, "0");
    const url = `${CONFIG.projectPath}/${CONFIG.prefix}${id}${CONFIG.extension}`;
    try {
      const response = await fetch(url, { cache: "no-cache" });
      if (response.status === 404) break;
      if (!response.ok) throw new Error(`Project request failed: ${response.status}`);
      const project = await response.json();
      grid.insertAdjacentHTML("beforeend", renderProject(project, id));
      loaded += 1;
    } catch (error) {
      console.warn(`Skipped ${url}:`, error.message);
      break;
    }
  }
  status.textContent = loaded ? `${loaded} selected engagement${loaded === 1 ? "" : "s"}` : "No project files were found.";
  observeReveals();
}

function renderProject(project, id) {
  const tags = Array.isArray(project.technologies) ? project.technologies.map(tag => `<span>${escapeHTML(tag)}</span>`).join("") : "";
  return `<article class="project-card reveal">
    <div><span class="project-number">${escapeHTML(project.number || id)}</span><span class="project-sector">${escapeHTML(project.sector)}</span></div>
    <h3>${escapeHTML(project.title)}</h3>
    <p class="project-summary">${escapeHTML(project.summary)}</p>
    <p class="project-impact">${escapeHTML(project.impact)}</p>
    <div class="project-tags">${tags}</div>
  </article>`;
}

function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#year").textContent = new Date().getFullYear();
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 24), { passive: true });
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); document.body.classList.remove("menu-open"); menu.setAttribute("aria-expanded", "false");
  }));
  observeReveals();
  loadProjects();
});

addEventListener("load", () => setTimeout(() => document.querySelector("#loader").classList.add("done"), 350));