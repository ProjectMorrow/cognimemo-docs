# Cognimemo

Cognimemo gives your AI agents persistent, queryable memory. Store, recall, and reflect on context across conversations.

## Quick Links

- [Quickstart](/getting-started/quickstart) — Get up and running in 5 minutes
- [Authentication](/getting-started/authentication) — Google SSO, email/password, and API keys
- [MCP Server](/mcp/overview) — Connect Cognimemo to Claude, Cursor, and other MCP-compatible agents
- [Billing](/billing/plans) — Plans, pricing, and pay-as-you-go

## Features

- **Retain** — Store memories as text, files, or URLs
- **Recall** — Query memories with semantic search
- **Reflect** — Generate insights and mental models from stored memories
- **Graph** — Visualize entity relationships and knowledge connections
- **API Keys** — Scoped keys for SDK, MCP, and web app access
- **Billing** — Free tier + paid plans with usage-based overages

## Getting Started

1. Sign up at [app.cognimemo.com](https://dev-app.cognimemo.com)
2. Create an API key in Settings → API Keys
3. Use the key with the Cognimemo SDK or MCP server

```bash
curl -X POST https://dev-api.cognimemo.com/v1/default/banks/default/memories \
  -H "Authorization: Bearer cmk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"content": "The user prefers dark mode"}'
```
