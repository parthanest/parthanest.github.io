/* ==========================================================================
   nav.js — The ONLY JavaScript on the site.
   Purpose: mobile hamburger menu toggle + close-on-link-click.
   Everything else is static HTML/CSS, so the page renders perfectly even
   if this script never runs.
   ========================================================================== */

(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  if (!nav || !toggle) return;

  // Toggle the mobile menu open/closed.
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu when any nav link is clicked.
  var links = nav.querySelectorAll(".nav__link");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }
})();
