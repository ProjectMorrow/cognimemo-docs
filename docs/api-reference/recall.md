# Recall

Retrieve memories with hybrid search (semantic + keyword + graph + temporal), fused and reranked.

```
POST /v1/me/banks/{bank}/memories/recall
```

```bash
curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/memories/recall \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{ "query": "how do I deploy?", "types": ["procedure"], "max_tokens": 800 }'
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | **Required.** Natural-language query (≤ 500 tokens). |
| `types` | string[] | Filter by fact type — any of `world` · `experience` · `observation` · `procedure` · `reasoning` · `preference` · `correction` · `profile`. Omit for all. |
| `max_tokens` | int | Budget for injected results (default 2048). |
| `budget` | string | Search thoroughness: `low` · `mid` · `high`. |
| `include_org` | bool | Blend the space's [org bank](/concepts/org-memory); requires `space`. Person wins on conflict. |
| `space` | string | The space the bank belongs to (needed for `include_org`). |
| `tags` / `tags_match` | — | Filter by tags (`any` · `all` · `exact` …). |
| `query_timestamp` | ISO 8601 | Recall "as of" this time; anchors relative dates and recency. |
| `temporal_window` | object | `{ "start": ISO, "end": ISO }` — rank memories in this period higher. |
| `min_scores` | object | Per-stage score floors, e.g. `{ "reranker": 0.5 }`. |

## Response

```json
{
  "results": [
    {
      "id": "…",
      "type": "procedure",
      "text": "To deploy: make build, kubectl apply -f prod.yaml, curl /health.",
      "context": "",
      "occurred_start": "2026-08-30T…", "occurred_end": "…", "mentioned_at": "…",
      "entities": ["Kubernetes"],
      "scores": { "final": 1.09, "semantic": 0.88, "keyword": 0.10 },
      "tags": [], "metadata": {}, "document_id": "…", "chunk_id": "…"
    }
  ],
  "usage": { "tokens_used": 312, "max_tokens": 800, "truncated": false }
}
```

`usage.org_blended` is `true` when a layered recall ran.

## SDK

::: code-group
```python [Python]
res = cm.recall("jane@acme.com", "how do I deploy?", types=["procedure"])
res = cm.recall_layered("jane@acme.com", "deploy policy", space="acme")
```
```typescript [TypeScript]
const res = await cm.recall("jane@acme.com", "how do I deploy?", { types: ["procedure"] });
const blended = await cm.recallLayered("jane@acme.com", "deploy policy", { space: "acme" });
```
:::
