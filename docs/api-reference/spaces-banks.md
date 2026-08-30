# Spaces & Banks

A **space** is an organization; a **bank** is one subject's memory store inside it. See the [memory model](/concepts/memory-model).

## Spaces

| Operation | Method & path |
|-----------|---------------|
| List spaces | `GET /v1/me/spaces` |
| Create space | `POST /v1/me/spaces` — `{ "id": "acme", "name": "Acme Corp" }` |
| List banks in a space | `GET /v1/me/spaces/{space}/banks` |
| Attach bank to space | `PUT /v1/me/spaces/{space}/banks/{bank}` |
| Remove bank from space | `DELETE /v1/me/spaces/{space}/banks/{bank}` (person + memories kept) |
| Delete space | `DELETE /v1/me/spaces/{space}` (banks become unassigned, never deleted) |

Each space has an implicit **org bank** at `__org__:{space}` — see [Org & layered memory](/concepts/org-memory).

## Banks

| Operation | Method & path |
|-----------|---------------|
| Get bank profile | `GET /v1/me/banks/{bank}` |
| Get / update config | `GET` / `PATCH /v1/me/banks/{bank}/config` |
| List memories | `GET /v1/me/banks/{bank}/memories` |
| List entities | `GET /v1/me/banks/{bank}/entities` |
| Delete bank | `DELETE /v1/me/banks/{bank}` |

### Bank config (selected)

`PATCH /v1/me/banks/{bank}/config` with `{ "updates": { … } }`:

| Key | Values | Purpose |
|-----|--------|---------|
| `retain_extraction_mode` | `concise` · `verbose` · `chunks` · `custom` | How retain extracts facts. `chunks` = verbatim, no LLM. |
| `retain_auto_entities` | bool | No-LLM entity extraction in `chunks` mode (default `false`). See [Entities](/concepts/entities). |
| `encryption` | `none` · `managed` | [Encryption at rest](/concepts/encryption). Needs the server master key. |
| `enable_temporal_retrieval` / `enable_graph_retrieval` / `enable_reranking` | bool | Recall pipeline stages. |
| `disposition_skepticism` / `_literalism` / `_empathy` | 1–5 | Reflect personality. |

### SDK

::: code-group
```python [Python]
cm.create_space("acme", name="Acme Corp")
cm.update_bank_config("jane@acme.com", encryption="managed", retain_auto_entities=True)
```
```typescript [TypeScript]
await cm.createSpace("acme", { name: "Acme Corp" });
await cm.updateBankConfig("jane@acme.com", { encryption: "managed", retainAutoEntities: true });
```
:::
