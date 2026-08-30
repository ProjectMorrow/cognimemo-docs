# API Reference

The REST API. Two ways to reach it, with **different base paths**:

| | Hosted (Gateway) | Self-hosted (Engine) |
|---|---|---|
| Base URL | `https://api.cognimemo.com` | your server, e.g. `http://localhost:8888` |
| Path base | `/v1/me/…` | `/v1/default/…` |
| Auth | per-project API key (Bearer) | your own |

`me` resolves to the project your API key belongs to — you never put a project id in the URL. See [Gateway API](/cloud/gateway) for the hosted surface (projects, keys, spaces).

## Authentication

```
Authorization: Bearer cmk_live_…
```

Keys are created in the console and carry **scopes**: `retain`, `recall`, `graph:read`, `mcp`. Mint least-privilege keys per integration.

## Endpoints

| Operation | Method & path |
|-----------|---------------|
| [Retain](/api-reference/retain) | `POST /v1/me/banks/{bank}/memories` |
| [Recall](/api-reference/recall) | `POST /v1/me/banks/{bank}/memories/recall` |
| [Reflect](/api-reference/reflect) | `POST /v1/me/banks/{bank}/reflect` |
| List memories | `GET /v1/me/banks/{bank}/memories` |
| Delete memory | `DELETE /v1/me/banks/{bank}/memories/{id}` |
| [Spaces & Banks](/api-reference/spaces-banks) | `…/spaces`, `…/spaces/{space}/banks/{bank}` |
| Entities | `GET /v1/me/banks/{bank}/entities` |
| Bank config | `PATCH /v1/me/banks/{bank}/config` |
| Audit | `GET /v1/me/audit` |

Bank ids are URL-encoded — an email bank id `jane@acme.com` becomes `jane%40acme.com`.

## Conventions

- All bodies are JSON; responses are JSON.
- Timestamps are ISO 8601.
- Recall responses include a `usage` object (`tokens_used`, `max_tokens`, `truncated`) for metering.
- Rate limits and quotas are per project; exceeding them returns `429`.
