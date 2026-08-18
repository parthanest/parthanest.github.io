/* =========================================================================
   data/achievements.js
   -------------------------------------------------------------------------
   Certifications, awards, key metrics and publications.
   Each array renders into its own block in the Achievements section.
   To add an item, copy a line/object and edit — no HTML changes needed.
   ========================================================================= */

window.PortfolioData = window.PortfolioData || {};

window.PortfolioData.achievements = {
  /* ---- Headline metrics (rendered as stat tiles) ---- */
  metrics: [
    { value: "75%+", label: "Infra cost reduction delivered" },
    { value: "90+",  label: "Microservices scaled on GKE" },
    { value: "4x",   label: "Google Cloud certifications" },
    { value: "5 yrs", label: "Forward-deployed engineering" }
  ],

  /* ---- Certifications ---- */
  certifications: [
    { name: "GCP Professional Cloud DevOps Engineer", issuer: "Google", date: "Aug 2025" },
    { name: "GCP Professional Cloud Architect", issuer: "Google", date: "Aug 2024" },
    { name: "GCP Professional Cloud Database Engineer", issuer: "Google", date: "Oct 2024" },
    { name: "HashiCorp Certified Terraform Associate", issuer: "HashiCorp", date: "Sep 2023" },
    { name: "AWS Course Completion", issuer: "Intellipaat", date: "Apr 2022" },
    { name: "DevOps Course Completion", issuer: "Intellipaat", date: "Apr 2022" }
  ],

  /* ---- Awards & recognition ---- */
  awards: [
    { name: "Star of the Month", note: "Awarded three times for leadership & client assistance" },
    { name: "Smart Project of the Year", note: "\u201CCape Demin\u201D — academic project award" }
  ],

  /* ---- Publications ---- */
  publications: [
    { name: "Istio Multi-cluster on Different Networks and Cloud Providers", venue: "Medium", date: "2024" },
    { name: "Adding Additional Pod IPv4 Address Ranges to a GKE Cluster", venue: "Medium", date: "2025" }
  ]
};
