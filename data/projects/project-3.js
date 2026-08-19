/* data/projects/project-3.js — Clone this file to add another project. */
window.registerProject({
  order: 3,
  title: "deflector-rag — Lightweight RAG Microservice",
  domain: "AI / LLMOps · Personal build",
  period: "In progress",
  description:
    "An event-driven Retrieval-Augmented Generation microservice that automates " +
    "support-ticket responses. GCS + Eventarc trigger an ETL pipeline into Cloud SQL " +
    "Postgres with pgvector for embeddings, served through managed/open-source LLMs with " +
    "a confidence-based guardrail layer.",
  tech: ["GCS", "Eventarc", "Cloud SQL", "pgvector", "Python", "Gemini Flash", "Hugging Face"],
  links: {}
});
