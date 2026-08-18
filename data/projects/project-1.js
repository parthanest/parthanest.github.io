/* =========================================================================
   data/projects/project-1.js
   -------------------------------------------------------------------------
   ONE project = ONE file. To add a new project, copy this file, rename it
   (e.g. project-4.js), edit the fields, and add a <script> tag for it in
   index.html. Order follows the "order" number below (lower = shown first).
   ========================================================================= */

window.registerProject({
  order: 1,
  title: "MoneyControl — On-Prem → GCP Migration & MLOps Modernization",
  domain: "Media & Finance · India",
  period: "Forward-deployed · 5-engineer workstream",
  description:
    "Led the client-facing migration of 90+ containerized workloads from on-premises " +
    "to GCP GKE. Stood up the full DevOps toolchain (Jenkins, GitLab, ArgoCD, SonarQube) " +
    "on GKE with Istio and Cloud Armor, and re-engineered the on-prem MLflow pipeline " +
    "into a cloud-native, GitOps-driven workflow.",
  tech: ["GKE", "Istio", "Jenkins", "ArgoCD", "SonarQube", "MLflow", "Apache Airflow", "Cloud Armor"],
  links: {
    // "Case study": "https://example.com"
  }
});
