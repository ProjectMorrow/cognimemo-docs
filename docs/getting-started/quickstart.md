# Quickstart

## 1. Create an account

Sign up at [dev-app.cognimemo.com](https://dev-app.cognimemo.com) using Google SSO or email/password.

## 2. Create an API key

Go to **Settings → API Keys** and create a key with the scopes you need:
- `retain` — Store memories
- `recall` — Retrieve memories
- `reflect` — Generate reflections
- `mcp` — Use with MCP server

Copy the key — it's only shown once.

## 3. Make your first request

```bash
# Store a memory
curl -X POST https://dev-api.cognimemo.com/v1/default/banks/default/memories \
  -H "Authorization: Bearer cmk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"content": "User prefers TypeScript and dark mode"}'

# Recall a memory
curl -X POST https://dev-api.cognimemo.com/v1/default/banks/default/memories/recall \
  -H "Authorization: Bearer cmk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the user preferences?"}'
```

## 4. Connect an AI agent (MCP)

Add Cognimemo to your MCP-compatible agent (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "cognimemo": {
      "url": "https://dev-api.cognimemo.com/mcp",
      "headers": {
        "Authorization": "Bearer cmk_live_..."
      }
    }
  }
}
```

## Next Steps

- [Authentication](/getting-started/authentication) — Learn about auth methods
- [MCP Server](/mcp/overview) — Full MCP integration guide
- [Billing](/billing/plans) — Plans and pricing
