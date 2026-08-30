# MCP Server

Cognimemo speaks the **Model Context Protocol**, so agents like Claude, Cursor, and Windsurf can retain and recall memories with no SDK.

## Endpoints

| Mode | URL | Auth |
|------|-----|------|
| **Key auth** | `https://api.cognimemo.com/mcp` | `Authorization: Bearer cmk_live_…` (key needs the `mcp` scope) |
| **Session** | `https://app.cognimemo.com/api/mcp` | Browser session cookie (from the console) |
| **Self-hosted** | `http://localhost:8787/mcp` | Local gateway |

## Connect Claude / Cursor

```json
{
  "mcpServers": {
    "cognimemo": {
      "url": "https://api.cognimemo.com/mcp",
      "headers": { "Authorization": "Bearer cmk_live_…" }
    }
  }
}
```

Create the key in [app.cognimemo.com](https://app.cognimemo.com) → Connect → API Keys, with the `mcp` scope enabled.

## Key tools

| Tool | Purpose |
|------|---------|
| `retain` | Store a memory (`content`, `context`, `tags`, `metadata`, `timestamp`, `document_id`). |
| `sync_retain` | Retain and wait, for read-after-write. |
| `recall` | Search memories. Supports **`types`** to filter by fact type (see below). |
| `reflect` | Generate a synthesized answer from memories + observations. |
| `list_memories` / `get_memory` | Browse and fetch memories. |
| `list_directives` / `create_directive` | Hard rules for reflect. |
| Mental-model tools | Create / refresh / read consolidated standing answers. |

Read-only tools (`recall`, `reflect`, `list_*`, `get_*`) are marked `readOnlyHint`; deletes are marked `destructiveHint`.

## Type-filtered recall

The `recall` tool's `types` accepts any of the eight fact types:

`world` · `experience` · `observation` · `procedure` · `reasoning` · `preference` · `correction` · `profile`

Omit it to search all types. See [Typed memory blocks](/concepts/typed-blocks).

## Encryption

Banks with [managed encryption](/concepts/encryption) work over MCP with **no client changes** — memories written via `retain` are stored encrypted, and `recall` / `reflect` decrypt transparently. Enable it per bank via the SDK or console, not an MCP tool.

## Deployment guidance

Set `COGNIMEMO_API_MCP_INSTRUCTIONS` on the server to append local rules to the `retain`/`recall` tool descriptions (e.g. which tags to use).
