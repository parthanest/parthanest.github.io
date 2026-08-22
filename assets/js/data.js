/* ============================================================================
 * data.js — SINGLE SOURCE OF TRUTH
 * ----------------------------------------------------------------------------
 * Everything the site renders lives here. To update the portfolio you should
 * ONLY ever need to edit this file — no HTML/CSS/JS structural changes.
 *
 * HOW TO ADD A NEW <thing>:
 *   • New project    -> append an object to `projects`
 *   • New job        -> append an object to `experience`
 *   • New skill group-> add a key to `skills`  (or push into an existing array)
 *   • New cert       -> append an object to `certifications`
 *   • New article    -> append an object to `publications`
 *
 * The renderer (main.js) reads these arrays on DOMContentLoaded and paints the
 * DOM. Order in the array === order on the page.
 * ==========================================================================*/

/* -------------------------------------------------------------------------- */
/* PROFILE — top-level identity used by hero, about, footer & <title>         */
/* -------------------------------------------------------------------------- */
const profile = {
  name: "Parthasarathy T",
  nickname: "Partha",
  title: "Forward Deployed Engineer",
  subtitle: "GCP Cloud Infrastructure · DevOps · Client Solutions",
  location: "Bengaluru, India",
  // Single elegant CTA — LinkedIn is the ONLY contact method.
  linkedin: "https://www.linkedin.com/in/parthaofficial/",
  // Short signature line under the hero name.
  tagline:
    "5+ years embedded within enterprise teams — turning cloud architecture into production systems.",
  // Long-form about paragraph(s). Each string becomes its own <p>.
  about: [
    "Forward Deployed Engineer partnering directly with enterprise clients to design, deploy, and optimize cloud solutions on Google Cloud across Fintech, Healthcare, and Media.",
    "I embed within client environments and translate architecture into production systems — GCP Compute, Apigee API delivery, and ML/LLM deployment on Vertex AI, Model Garden, and MLflow.",
    "Track record leading on-prem to GCP migrations, standing up CI/CD pipelines, and delivering 75%+ infrastructure cost reduction through automated, security-hardened pipelines."
  ],
  // Headline stats shown as a small strip near the hero / about.
  stats: [
    { value: "5+",  label: "Years in Cloud & DevOps" },
    { value: "4x",  label: "Google Cloud Certified" },
    { value: "75%", label: "Infra Cost Reduction" },
    { value: "90+", label: "Workloads Migrated" }
  ]
};

/* -------------------------------------------------------------------------- */
/* EXPERIENCE — timeline, most recent first                                   */
/* -------------------------------------------------------------------------- */
const experience = [
  {
    role: "Senior Associate — Infrastructure (Forward Deployed)",
    company: "Publicis Sapient",
    period: "Jul 2025 — Present",
    current: true,
    points: [
      "Built multi-stage CI/CD (Terraform Enterprise, Cloud Build) inside client environments.",
      "Implemented VPC Service Controls & IAM guardrails for regulated client workloads.",
      "Designed and deployed 20+ Apigee API proxies for secure API delivery.",
      "Deployed Vertex AI endpoints integrated with Cloud Run for real-time inference."
    ]
  },
  {
    role: "DevOps Engineer (Client-Facing)",
    company: "Niveus Solutions Pvt. Ltd.",
    period: "Jul 2023 — Jul 2025",
    current: false,
    points: [
      "Led a team of 4–5 engineers on client-facing cloud delivery.",
      "Drove on-prem to GCP migrations with Terraform IaC — VPC, VPN, IAM, Firewall, DNS, GKE.",
      "Ran production GKE clusters with hardened node pools and autoscaling across 90+ microservices.",
      "Hardened access with Workload Identity + RBAC; deployed Istio service mesh.",
      "Standardized deployments with Helm; built observability on Dynatrace & Cloud Monitoring."
    ]
  },
  {
    role: "Project Engineer",
    company: "Eratronics Pvt. Ltd.",
    period: "Jul 2021 — Jul 2023",
    current: false,
    points: [
      "Provisioned 30+ GCP resources across projects and environments.",
      "Managed configuration at scale with Ansible.",
      "Supported Kafka clusters for high-throughput data pipelines.",
      "Built CI/CD with Bitbucket Pipelines and Terraform IaC."
    ]
  }
];

/* -------------------------------------------------------------------------- */
/* PROJECTS — case-study format (challenge / approach / outcome)              */
/* Add a new project by appending one object below. `tags` render as chips.   */
/* -------------------------------------------------------------------------- */
const projects = [
  {
    title: "On-Prem to GCP Migration & MLOps Modernization",
    client: "Moneycontrol, India",
    challenge:
      "A large media platform needed to move 90+ containerized workloads off on-prem infrastructure and modernize a legacy ML workflow — without disrupting production.",
    approach:
      "Forward-deployed with the client's engineering team, I led a 5-engineer migration to GKE and stood up a full DevOps toolchain (Jenkins, GitLab, ArgoCD, SonarQube) on GKE with Istio and Cloud Armor. I re-engineered the on-prem MLflow pipeline into a cloud-native workflow orchestrated by Apache Airflow with GitOps delivery via ArgoCD.",
    outcome:
      "A cloud-native platform with GitOps delivery, service-mesh traffic control, and a modern, reproducible ML pipeline running end-to-end on GCP.",
    tags: ["GKE", "Istio", "ArgoCD", "Cloud Armor", "MLflow", "Airflow", "SonarQube"]
  },
  {
    title: "Cloud Run, Apigee & Vertex AI Model Deployment",
    client: "BUPA, UK",
    challenge:
      "A healthcare enterprise needed backend services and ML models deployed for secure, real-time consumption within an Agile delivery cadence.",
    approach:
      "As the sole forward-deployed engineer embedded with the client's Agile team, I deployed backend services on Cloud Run integrated with Apigee, then deployed and validated ML models to Vertex AI endpoints wired to Cloud Run for real-time inference. I adapted the MLflow pipeline for cloud execution with Airflow, Jenkins, and ArgoCD.",
    outcome:
      "Production ML models served through governed Apigee APIs and Cloud Run, with a repeatable, cloud-native delivery path from experiment to endpoint.",
    tags: ["Cloud Run", "Apigee", "Vertex AI", "MLflow", "Airflow", "Jenkins", "ArgoCD"]
  },
  {
    title: "Healthcare Insurance Claims Automation",
    client: "Client Confidential",
    challenge:
      "A healthcare insurer wanted to eliminate manual claim reviews and reimburse customers instantly.",
    approach:
      "Built and deployed an automated claims-processing pipeline using image recognition to read and validate claim documents, triggering instant customer reimbursement.",
    outcome:
      "Automated, near-instant claims processing that removed manual bottlenecks and accelerated customer reimbursement.",
    tags: ["Image Recognition", "Automation", "GCP", "MLOps"]
  }
];

/* -------------------------------------------------------------------------- */
/* SKILLS — grouped (NOT a flat tag list). Add a group = add a key.           */
/* -------------------------------------------------------------------------- */
const skills = {
  "Cloud & Compute": [
    "Compute Engine", "GKE", "Cloud Run", "Cloud Functions",
    "Cloud Build", "Pub/Sub", "Managed Instance Groups"
  ],
  "Networking": [
    "VPC", "VPC Peering", "Cloud VPN", "Cloud Interconnect",
    "Load Balancing", "Cloud NAT", "Cloud DNS"
  ],
  "MLOps / LLMOps": [
    "Vertex AI", "MLflow", "Hugging Face", "Apache Airflow", "Python"
  ],
  "Security & IAM": [
    "IAM Policies", "Service Accounts", "Workload Identity",
    "VPC Service Controls", "Cloud Armor", "RBAC"
  ],
  "Containers": [
    "Kubernetes (GKE)", "Docker", "Artifact Registry", "Istio", "Helm"
  ],
  "Infrastructure as Code": [
    "Terraform", "Ansible"
  ],
  "CI/CD": [
    "Jenkins", "GitLab", "GitHub Actions", "ArgoCD", "Bitbucket Pipelines"
  ],
  "Databases": [
    "Cloud SQL", "PostgreSQL", "MySQL", "BigQuery",
    "Redis Enterprise", "Memorystore"
  ],
  "Observability": [
    "Cloud Monitoring", "Dynatrace", "SonarQube"
  ]
};

/* -------------------------------------------------------------------------- */
/* CERTIFICATIONS — most recent first                                         */
/* -------------------------------------------------------------------------- */
const certifications = [
  { name: "Google Cloud — Professional Cloud DevOps Engineer",   issuer: "Google Cloud", date: "Aug 2025" },
  { name: "Google Cloud — Professional Cloud Database Engineer", issuer: "Google Cloud", date: "Oct 2024" },
  { name: "Google Cloud — Professional Cloud Architect",         issuer: "Google Cloud", date: "Aug 2024" },
  { name: "HashiCorp Certified: Terraform Associate",            issuer: "HashiCorp",    date: "Sep 2023" }
];

/* -------------------------------------------------------------------------- */
/* EDUCATION                                                                   */
/* -------------------------------------------------------------------------- */
const education = [
  {
    degree: "BE, Electronics Engineering",
    school: "Sri Sairam College of Engineering (VTU University)",
    location: "Bengaluru, India",
    period: "Aug 2018 — Feb 2022"
  }
];

/* -------------------------------------------------------------------------- */
/* PUBLICATIONS — Medium articles. `url` optional (leave "" if none yet).     */
/* -------------------------------------------------------------------------- */
const publications = [
  {
    title: "Istio Multi-cluster on Different Networks and Cloud Providers",
    outlet: "Medium",
    year: "2024",
    url: ""
  },
  {
    title: "Adding Additional Pod IPv4 Address Ranges to a GKE Cluster",
    outlet: "Medium",
    year: "2025",
    url: ""
  }
];

/* -------------------------------------------------------------------------- */
/* EXPORT — expose one namespace the renderer reads from.                     */
/* (Plain global object so it works with a <script> tag, no build step.)      */
/* -------------------------------------------------------------------------- */
window.PORTFOLIO_DATA = {
  profile,
  experience,
  projects,
  skills,
  certifications,
  education,
  publications
};
