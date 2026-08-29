# MCP Server

Cognimemo provides an MCP (Model Context Protocol) server that allows AI agents to store and retrieve memories.

## Connecting

Add Cognimemo to your MCP client configuration:

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Cursor

Add to your Cursor MCP settings:

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

## Available Tools

The MCP server exposes these tools:

| Tool | Scope Required | Description |
|------|---------------|-------------|
| `retain` | `retain` | Store a memory |
| `recall` | `recall` | Retrieve memories by query |
| `reflect` | `reflect` | Generate insights from memories |
| `list_banks` | `recall` | List memory banks |
| `list_entities` | `graph:read` | List extracted entities |

## API Key Requirements

Your API key must have the `mcp` scope (or individual operation scopes like `retain`, `recall`, `reflect`).

Create a key in **Settings → API Keys** with the `mcp` scope.
