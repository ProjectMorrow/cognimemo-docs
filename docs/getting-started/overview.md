# Overview

Cognimemo is a persistent memory service for AI agents. It provides three core operations:

- **Retain** — Store memories (text, files, URLs)
- **Recall** — Retrieve memories via semantic search
- **Reflect** — Generate insights from accumulated memories

## Architecture

```
Client (SDK/MCP/Web) → Gateway (auth, quotas, billing) → Engine (memory storage, embeddings, graph)
```

- **Gateway** — API key auth, rate limiting, quota enforcement, Stripe billing
- **Engine** — Per-org Postgres schemas, vector embeddings, entity graphs
- **Web** — Next.js dashboard for managing keys, viewing usage, billing

## Multi-tenancy

Each organization gets an isolated Postgres schema. API keys are scoped to an org and can be restricted by operation type.

## Authentication

Cognimemo supports:
- Google SSO via WorkOS
- Email + password via WorkOS
- API keys for SDK/MCP access

## Next Steps

- [Quickstart](/getting-started/quickstart)
- [Authentication](/getting-started/authentication)
- [MCP Server](/mcp/overview)
