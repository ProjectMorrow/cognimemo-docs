# Authentication

Cognimemo supports three authentication methods:

## Google SSO

Sign in with your Google account via WorkOS. No configuration needed — just click "Sign in with Google" on the login page.

## Email + Password

Create an account with email and password. Passwords are managed by WorkOS User Management.

## API Keys

API keys are used for programmatic access (SDK, MCP, CLI). Keys are:

- Prefixed with `cmk_live_`
- SHA-256 hashed at rest
- Scoped to specific operations
- Revocable at any time

### Scopes

| Scope | Description |
|-------|-------------|
| `retain` | Store memories |
| `recall` | Retrieve memories |
| `reflect` | Generate reflections |
| `files.retain` | Store file memories |
| `graph:read` | Read entity graph |
| `mcp` | Use with MCP server |

### Creating Keys

1. Go to **Settings → API Keys**
2. Click "Create key"
3. Select scopes
4. Copy the key — it's shown only once

### Using Keys

```bash
curl -H "Authorization: Bearer cmk_live_..." https://dev-api.cognimemo.com/v1/...
```
