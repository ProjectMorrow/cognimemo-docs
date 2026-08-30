# Retain

Store one or more memories in a bank.

```
POST /v1/me/banks/{bank}/memories
```

```bash
curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/memories \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "content": "Jane joined the Gemini team at DeepMind.",
        "fact_type": "world",
        "entities": [{"text": "Jane", "type": "PERSON"}, {"text": "Gemini", "type": "PROJECT"}],
        "tags": ["team"] }
    ]
  }'
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| `items` | array | One or more memory items (below). Batch to amortize cost. |
| `document_id` | string | Optional: group all items under a document. |
| `async` | bool | Process in the background; returns operation ids. |

### Item fields

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | **Required.** The memory text. |
| `fact_type` | string | Store as a typed block: `world` · `experience` · `observation` · `procedure` · `reasoning` · `preference` · `correction` · `profile`. Default: auto-classified. See [Typed blocks](/concepts/typed-blocks). |
| `context` | string | Extra context for the memory. |
| `timestamp` | ISO 8601 | When the event occurred (drives temporal recall). |
| `entities` | array | `[{ "text": "...", "type": "PERSON" }]` — guaranteed-recognized entities, merged with extracted ones. See [Entities](/concepts/entities). |
| `resolve_entities` | bool | Resolve supplied entities against existing ones (default `true`). |
| `tags` | string[] | Visibility/filtering tags. |
| `metadata` | object | User-defined key/value metadata. |
| `update_mode` | string | With a repeated `document_id`: `replace` (default) or `append`. |

## Query scoping

Add `?space={space}` (or `space` in the SDK) to attach the bank to an organization on first use. Retaining to `__org__:{space}` writes to the [org bank](/concepts/org-memory).

## Response

```json
{ "success": true, "memories_created": 1, "document_id": "…" }
```

## SDK

::: code-group
```python [Python]
cm.retain(bank_id="jane@acme.com", content="…", fact_type="preference",
          entities=[{"text": "Jane", "type": "PERSON"}], tags=["team"])
```
```typescript [TypeScript]
await cm.retain("jane@acme.com", "…", { factType: "preference",
  entities: [{ text: "Jane", type: "PERSON" }], tags: ["team"] });
```
:::
