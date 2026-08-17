// ===== Theme toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeToggleLabel');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== Mobile nav toggle =====
const sidebar = document.getElementById('sidebar');
const mobileNavToggle = document.getElementById('mobileNavToggle');

mobileNavToggle.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  mobileNavToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Scroll-spy active nav state =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

sections.forEach(section => observer.observe(section));