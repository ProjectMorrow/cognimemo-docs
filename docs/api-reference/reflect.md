# Reflect

Generate a synthesized, disposition-aware answer from a bank's memories and consolidated observations. Unlike recall (which returns raw memories), reflect returns a written answer.

```
POST /v1/me/banks/{bank}/reflect
```

```bash
curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/reflect \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{ "query": "What is Jane'\''s release cadence?" }'
```

## Body

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | **Required.** The question to answer. |
| `context` | string | Extra context to steer the answer. |
| `budget` | string | Retrieval thoroughness: `low` · `mid` · `high`. |
| `tags` / `tags_match` | — | Restrict which memories are considered. |
| `fact_types` | string[] | Restrict which fact types feed the answer. |
| `response_schema` | object | Optional JSON schema for structured output. |

## Response

```json
{ "response": "Jane ships releases on Fridays…", "usage": { "tokens_used": 640 } }
```

Reflect is shaped by the bank's **disposition** (skepticism / literalism / empathy, 1–5) and any **directives** (hard rules) configured on the bank.

## SDK

::: code-group
```python [Python]
answer = cm.reflect(bank_id="jane@acme.com", query="What is Jane's release cadence?")
```
```typescript [TypeScript]
const answer = await cm.reflect("jane@acme.com", "What is Jane's release cadence?");
```
:::
