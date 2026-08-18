/* =========================================================================
   scripts/cv-enhancer-proxy.worker.js
   -------------------------------------------------------------------------
   OPTIONAL but RECOMMENDED serverless proxy (Cloudflare Worker).
   Keeps GH_PAT server-side so it is NEVER exposed in the browser.

   The front-end (js/cv-enhancer.js, mode:"proxy") POSTs:
     { event_type, client_payload }
   and this Worker forwards it to GitHub's repository_dispatch API using the
   secret GH_PAT stored in the Worker environment (wrangler secret put GH_PAT).

   Deploy:
     1. npm i -g wrangler
     2. wrangler init cv-enhancer-proxy
     3. paste this file into src/index.js
     4. wrangler secret put GH_PAT        # fine-grained PAT, Contents:RW on the repo
     5. set OWNER / REPO / ALLOWED_ORIGIN vars in wrangler.toml
     6. wrangler deploy
   Then set proxyEndpoint in js/cv-enhancer.js to the deployed URL.
   ========================================================================= */

export default {
  async fetch(request, env) {
    const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || "https://parthanest.github.io";

    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Pre-flight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400, headers: cors });
    }

    const eventType = body.event_type || "cv-enhancer-request";
    const payload = body.client_payload || {};

    // Basic guardrails
    if (!payload.filename || !payload.content_base64) {
      return new Response("Missing filename or content", { status: 422, headers: cors });
    }

    const owner = env.OWNER;
    const repo = env.REPO;
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.GH_PAT}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
          "User-Agent": "cv-enhancer-proxy",
        },
        body: JSON.stringify({ event_type: eventType, client_payload: payload }),
      }
    );

    if (ghRes.status !== 204) {
      const detail = await ghRes.text().catch(() => "");
      return new Response(`GitHub dispatch failed: ${ghRes.status} ${detail}`, {
        status: 502,
        headers: cors,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 202,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
