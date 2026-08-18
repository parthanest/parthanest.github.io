/* =========================================================================
   data/projects.js  — every project rendered as a card in the Projects section.
   To add a project: copy an object below, edit the fields, done.
   ========================================================================= */

window.PortfolioData = window.PortfolioData || {};

window.PortfolioData.projects = [
  {
    title: "MoneyControl — On-Prem → GCP Migration & MLOps Modernization",
    domain: "Media & Finance · India",
    period: "Forward-deployed · 5-engineer workstream",
    description:
      "Led the client-facing migration of 90+ containerized workloads from on-premises to GCP GKE. Stood up the full DevOps toolchain (Jenkins, GitLab, ArgoCD, SonarQube) on GKE with Istio, Cloud Armor and centralized monitoring, and re-engineered the on-prem MLflow pipeline into a cloud-native, GitOps-driven workflow.",
    pipeline: [
      { stage: "Ingest", detail: "Airflow DAGs" },
      { stage: "Train", detail: "MLflow tracking" },
      { stage: "Deploy", detail: "ArgoCD / GitOps" },
      { stage: "Scale", detail: "GKE + Istio" }
    ],
    tech: ["GKE", "Istio", "Jenkins", "GitLab", "ArgoCD", "SonarQube", "MLflow", "Apache Airflow", "Cloud Armor"],
    links: {}
  },
  {
    title: "BUPA — Cloud Run, Apigee & Vertex AI Model Deployment",
    domain: "Healthcare & Insurance · UK",
    period: "Sole forward-deployed engineer · architecture → go-live",
    description:
      "Owned solution delivery end-to-end for the client's Agile team. Deployed and optimized backend services on Cloud Run behind Apigee for secure API traffic, and deployed/validated ML models to Vertex AI endpoints connected to Cloud Run for real-time consumption.",
    pipeline: [
      { stage: "Ingest", detail: "Apigee proxies" },
      { stage: "Train", detail: "MLflow / Airflow" },
      { stage: "Deploy", detail: "Vertex AI endpoints" },
      { stage: "Scale", detail: "Cloud Run" }
    ],
    tech: ["Cloud Run", "Apigee", "Vertex AI", "MLflow", "Apache Airflow", "Jenkins", "ArgoCD"],
    links: {}
  },
  {
    title: "Enterprise On-Prem → GCP Migrations (Niveus)",
    domain: "Multi-domain · Client-facing DevOps lead",
    period: "Led a team of 4–5 engineers",
    description:
      "Delivered modular Terraform IaC (VPC, VPN, IAM, Firewall, DNS, GKE) for enterprise migrations. Architected private production GKE clusters with hardened node pools, implemented HPA/VPA/Cluster Autoscaler across 90+ microservices, and built Dynatrace + Cloud Monitoring observability to cut MTTR.",
    pipeline: [
      { stage: "Design", detail: "Terraform IaC" },
      { stage: "Secure", detail: "Workload Identity" },
      { stage: "Deploy", detail: "Private GKE" },
      { stage: "Scale", detail: "HPA / VPA / CA" }
    ],
    tech: ["Terraform", "GKE", "Istio", "Helm", "Workload Identity", "Dynatrace", "Cloud Monitoring"],
    links: {}
  },
  {
    title: "deflector-rag — Lightweight RAG Microservice",
    domain: "AI / LLMOps · Personal build",
    period: "In progress",
    description:
      "An event-driven Retrieval-Augmented Generation microservice that automates support-ticket responses. GCS + Eventarc trigger an ETL pipeline into Cloud SQL Postgres with pgvector for embeddings, served through managed/open-source LLMs with a confidence-based guardrail layer.",
    pipeline: [
      { stage: "Ingest", detail: "GCS + Eventarc" },
      { stage: "Embed", detail: "bge-base-en-v1.5" },
      { stage: "Store", detail: "Cloud SQL pgvector" },
      { stage: "Serve", detail: "Gemini Flash / OSS LLM" }
    ],
    tech: ["GCS", "Eventarc", "Cloud SQL", "pgvector", "Python", "Gemini Flash", "Hugging Face"],
    links: {}
  }
];
