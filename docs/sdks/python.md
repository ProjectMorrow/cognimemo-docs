# Python SDK

`cognimemo-client` — the official Python client.

```bash
pip install cognimemo-client
```

## Quickstart

```python
from cognimemo_client import Cognimemo

cm = Cognimemo(base_url="https://api.cognimemo.com", api_key="cmk_live_…")

cm.retain(bank_id="jane@acme.com", content="Jane ships on Fridays.")
res = cm.recall(bank_id="jane@acme.com", query="when does Jane ship?")
for r in res.results:
    print(r.type, r.text, r.occurred_start, r.scores)
```

Prefer `await cm.aretain(...)` / `await cm.arecall(...)` in async code — every method has an `a`-prefixed async version. For clean shutdown, use it as a context manager:

```python
with Cognimemo(base_url="https://api.cognimemo.com", api_key="cmk_live_…") as cm:
    cm.retain("jane@acme.com", "…")
```

## Data model — space → bank → memories

```python
cm.create_space("acme", name="Acme Corp")
cm.retain(bank_id="jane@acme.com", content="Jane prefers dark mode", space="acme")
cm.recall(bank_id="jane@acme.com", query="what does jane prefer?", space="acme")

cm.list_spaces()
cm.list_space_banks("acme")
cm.add_bank_to_space("acme", "raj@acme.com")
cm.remove_bank_from_space("acme", "raj@acme.com")   # person + memories kept
```

## Typed memory blocks

Each helper stores a distinct **memory type** that's processed and recalled differently
— `procedure` (how a task is done), `reasoning` (why a decision was made), `preference`
(how the user wants things), `correction` (a "no, do it this way" signal), `profile`
(the user's tools/access). See [Memory types & typed blocks](/concepts/typed-blocks)
for what each means and when to use it.

```python
cm.retain_preference("jane@acme.com", "For day-planning, use personal Gmail, never work mail.")
cm.retain_procedure("jane@acme.com", ["make build", "kubectl apply -f prod.yaml"], rationale="prod deploy")
cm.retain_reasoning("jane@acme.com", "Chose gRPC over REST: p99 latency mattered more.")
cm.retain_correction("jane@acme.com", "No — drain the pod before restart.")
cm.update_profile("jane@acme.com", "Admin on AWS, GitHub, Grafana.")

# any type directly:
cm.retain(bank_id="jane@acme.com", content="Acme HQ is in Berlin.", fact_type="world")

# type-filtered recall:
cm.recall(bank_id="jane@acme.com", query="how to deploy", types=["procedure"])
```

See [Typed memory blocks](/concepts/typed-blocks) for the full list.

## Layered / org memory

```python
cm.retain(bank_id="__org__:acme", content="Deploy freeze every December.")
cm.recall(bank_id="jane@acme.com", query="deploy policy", space="acme", include_org=True)
# or:
cm.recall_layered("jane@acme.com", "deploy policy", space="acme")
```

## Entities

```python
cm.retain(bank_id="jane@acme.com",
    content="Jane joined the DeepMind team on Gemini.",
    entities=[{"text": "Jane", "type": "PERSON"}, {"text": "Gemini", "type": "PROJECT"}])

cm.entities.list_entities("jane@acme.com")

# no-LLM auto-entities for verbatim ingest (off by default):
cm.update_bank_config("jane@acme.com", retain_auto_entities=True)
```

## Encryption at rest

Encryption is a **project-level policy set in the console** (Settings → Security), not an SDK call. When it's on, memories are stored encrypted and the SDK keeps returning plaintext — nothing changes in your code. See [Encryption at rest](/concepts/encryption).

## Recall response

`recall(...)` returns `RecallResponse` with `.results` (a list of `MemoryFact`) and `.usage`. Each `MemoryFact`:

| field | meaning |
|---|---|
| `type` | fact type (`world` … `profile`) |
| `text`, `context` | the memory body (decrypted transparently) |
| `occurred_start` / `occurred_end` / `mentioned_at` | temporal anchors |
| `entities` | linked entity names |
| `scores` | `{final, semantic, keyword}` |
| `metadata`, `tags`, `document_id`, `chunk_id` | provenance |

`.usage` reports `{tokens_used, max_tokens, truncated}` (and `org_blended` for layered recall).

## Reflect

```python
answer = cm.reflect(bank_id="jane@acme.com", query="What is Jane's release cadence?")
```
