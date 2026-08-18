/* =========================================================================
   data/expertise.js
   -------------------------------------------------------------------------
   Your technical skills, grouped into domains.
   To add a new expertise card: copy any object in the `cards` array and edit.
   To add a new stack group: copy any object in the `stack` array and edit.
   The UI reads this file automatically — you never touch the HTML/CSS.
   ========================================================================= */

window.PortfolioData = window.PortfolioData || {};

window.PortfolioData.expertise = {
  /* ---- Highlighted expertise cards (shown in the About / Expertise grid) ---- */
  cards: [
    {
      tag: "Cloud Systems",
      title: "GCP Architecture & Compute",
      body: "Compute Engine, GKE, Cloud Run & Cloud Functions provisioned, secured, and run at production scale — backed by 4x Google Cloud Professional certifications."
    },
    {
      tag: "DevOps & CI/CD",
      title: "Pipelines & Automation",
      body: "Multi-stage delivery with Jenkins, GitHub Actions, ArgoCD, Cloud Build & Airflow — GitOps release workflows that cut infra cost by 75%+."
    },
    {
      tag: "MLOps & LLMOps",
      title: "Model Delivery to Production",
      body: "Vertex AI endpoints, Model Garden, MLflow & Hugging Face — deploying and monitoring models wired into live client-facing services."
    },
    {
      tag: "Architecture",
      title: "Networking, Security & IaC",
      body: "VPC Service Controls, Workload Identity, Cloud Armor, and modular Terraform/Ansible for hardened, compliant, repeatable infrastructure."
    }
  ],

  /* ---- Full tech-stack, grouped by category (shown in the Stack section) ---- */
  stack: [
    {
      group: "Cloud & Compute",
      chips: ["Compute Engine", "GKE", "Cloud Run", "Cloud Functions", "Cloud Build", "Pub/Sub", "Managed Instance Groups"]
    },
    {
      group: "Networking & Security",
      chips: ["VPC / VPC Peering", "Cloud VPN", "Cloud Interconnect", "Cloud Load Balancing", "Cloud NAT / DNS", "VPC Service Controls", "Cloud Armor", "IAM / Workload Identity", "RBAC"]
    },
    {
      group: "Containers & Orchestration",
      chips: ["Kubernetes (GKE)", "Docker", "Helm", "Istio Service Mesh", "Artifact Registry / GCR"]
    },
    {
      group: "CI/CD & IaC",
      chips: ["Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab", "ArgoCD", "Bitbucket Pipelines", "Cloud Build"]
    },
    {
      group: "MLOps & Data",
      chips: ["Vertex AI", "Model Garden", "MLflow", "Hugging Face", "Apache Airflow", "Apache Kafka", "BigQuery"]
    },
    {
      group: "Databases",
      chips: ["Cloud SQL", "PostgreSQL / pgvector", "MySQL", "Redis Enterprise", "Memorystore"]
    },
    {
      group: "API & Observability",
      chips: ["Apigee", "Dynatrace", "GCP Cloud Monitoring", "SonarQube"]
    },
    {
      group: "Core & Scripting",
      chips: ["Python", "Bash", "Linux / Unix Admin"]
    }
  ]
};
