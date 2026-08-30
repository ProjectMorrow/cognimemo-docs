# Gateway API

Hosted Cognimemo runs behind the **Gateway** at `https://api.cognimemo.com`. It authenticates each request, resolves it to *your* project, then proxies to the engine — so every engine capability works unchanged under `/v1/me`.

| | Hosted (Gateway) | Self-hosted (Engine) |
|---|---|---|
| Base URL | `https://api.cognimemo.com` | your server (`:8888`) |
| Path base | `/v1/me/…` | `/v1/default/…` |
| Auth | per-project API key | your own |
| Adds | projects, keys, spaces, metering, audit, billing | — |

## Hierarchy

```
Account → Project → Space (org) → Bank (person/agent) → Memories
```

- **Project** — an isolated tenant with its own data, keys, members, and billing.
- **`me`** in the path always means "the project this key belongs to" — no project id in the URL.

## API keys

Create per-project keys in [app.cognimemo.com](https://app.cognimemo.com) → Connect → API Keys. Keys are prefixed `cmk_live_…` and carry **scopes** so you can mint least-privilege keys:

| Scope | Grants |
|-------|--------|
| `retain` | write memories |
| `recall` | read/search memories, reflect |
| `graph:read` | read the entity graph |
| `mcp` | use the [MCP](/mcp/overview) surface |

```bash
curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/memories/recall \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{"query":"what does jane prefer?"}'
```

## What's project-scoped

Everything is isolated per project: banks, spaces, memories, entities, keys, members, usage/metering, audit logs, and billing. A key for one project can never read another project's data.

## Console

The web console at [app.cognimemo.com](https://app.cognimemo.com) manages projects, spaces, banks, members, API keys, usage, billing, and the memory/graph browser. It also exposes a session-authenticated MCP endpoint at `app.cognimemo.com/api/mcp`.
