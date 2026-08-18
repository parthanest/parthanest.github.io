/* =========================================================================
   data/about-me.js
   -------------------------------------------------------------------------
   ONLY personal info: name, title, tagline, bio, location, and social links.
   Edit this file to update your profile — nothing else needs to change.
   ========================================================================= */

window.PortfolioData = window.PortfolioData || {};

window.PortfolioData.about = {
  name: "Parthasarathy T",
  title: "Forward-Deployed Engineer · GCP",
  tagline: "I engineer the bridge where prototypes learn to survive production.",
  location: "Bengaluru, IN",
  badge: "4x GCP Certified",
  status: "Open to select engagements",

  // Short bio shown in the About section
  bio:
    "Forward-Deployed Engineer with 5 years partnering directly with enterprise " +
    "clients to design, deploy and optimize cloud solutions on Google Cloud Platform. " +
    "I embed inside client environments — between data scientists, architects and " +
    "product owners — and own the outcome once a system goes live. I've led on-prem-to-GCP " +
    "migrations, stood up CI/CD toolchains (Jenkins, GitHub Actions, ArgoCD, Airflow), and " +
    "delivered a 75%+ reduction in infrastructure cost through automated, hardened pipelines.",

  // Contact email (used in the Contact section)
  email: "parthaofficial@hotmail.com",

  // Social links — label + url. Add/remove freely.
  socials: [
    { label: "GitHub",   short: "GH", url: "https://github.com/parthanest" },
    { label: "LinkedIn", short: "IN", url: "https://www.linkedin.com/in/parthaofficial" },
    { label: "Medium",   short: "MD", url: "https://medium.com/@parthaofficial" }
  ]
};
