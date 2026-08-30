# Quickstart

Get from zero to a working memory in five minutes.

## 1. Create a project and an API key

Sign in at [app.cognimemo.com](https://app.cognimemo.com), create a **project**, then open **Connect → API Keys** and create a key. Keys are prefixed `cmk_live_…` and are scoped to that one project.

## 2. Install an SDK

::: code-group
```bash [Python]
pip install cognimemo-client
```
```bash [TypeScript]
npm install @cognimemo/client
```
:::

## 3. Retain and recall

::: code-group
```python [Python]
from cognimemo_client import Cognimemo

cm = Cognimemo(base_url="https://api.cognimemo.com", api_key="cmk_live_…")

# Store a memory
cm.retain(bank_id="jane@acme.com", content="Jane ships releases on Fridays.")

# Ask a question
res = cm.recall(bank_id="jane@acme.com", query="when does Jane ship?")
for r in res.results:
    print(r.type, "—", r.text)
```
```typescript [TypeScript]
import { CognimemoClient } from "@cognimemo/client";

const cm = new CognimemoClient({ baseUrl: "https://api.cognimemo.com", apiKey: "cmk_live_…" });

await cm.retain("jane@acme.com", "Jane ships releases on Fridays.");

const res = await cm.recall("jane@acme.com", "when does Jane ship?");
res.results.forEach((r) => console.log(r.type, "—", r.text));
```
```bash [cURL]
curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/memories \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{"items":[{"content":"Jane ships releases on Fridays."}]}'

curl https://api.cognimemo.com/v1/me/banks/jane%40acme.com/memories/recall \
  -H "Authorization: Bearer cmk_live_…" -H "Content-Type: application/json" \
  -d '{"query":"when does Jane ship?"}'
```
:::

## 4. Reflect (optional)

Ask Cognimemo to synthesize an answer from everything it knows about the bank:

```python
print(cm.reflect(bank_id="jane@acme.com", query="What is Jane's release cadence?"))
```

## Where memories live

```
Account → Project → Space (org) → Bank (person/agent) → Memories
```

- A **bank** is one subject's memory store (e.g. a user or an agent).
- A **space** is an organization that groups banks and has a shared [org bank](/concepts/org-memory).
- `me` in the URL resolves to the project your API key belongs to.

## Next steps

- [Typed memory blocks](/concepts/typed-blocks) — procedures, preferences, corrections, and more
- [Python SDK](/sdks/python) · [TypeScript SDK](/sdks/typescript)
- [MCP Server](/mcp/overview) — connect Claude, Cursor, and other agents
- [API Reference](/api-reference/overview)
