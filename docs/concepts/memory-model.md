# Memory model

Cognimemo is a **note-taker for agents**: your agent does the work and tells Cognimemo what it learned; next time, Cognimemo hands that knowledge back. Cognimemo owns durable, typed storage and fast typed recall — it never executes or drives your agent.

## Hierarchy

```
Account → Project → Space (org) → Bank (person/agent) → Memories
```

| Level | What it is |
|-------|------------|
| **Account** | You — signed in at [app.cognimemo.com](https://app.cognimemo.com). |
| **Project** | An isolated tenant: its own data, API keys, members, and billing. |
| **Space** | An organization inside a project. Every space has an implicit [org bank](/concepts/org-memory). |
| **Bank** | One subject's memory store (a user, an agent, a session). |
| **Memory** | A single stored unit — a fact, an event, or a [typed block](/concepts/typed-blocks). |

Isolation is strict: an API key for one project can never read another project's data, and banks don't leak across each other.

## The three operations

- **Retain** — store a memory. Embeddings (and, with a real LLM, entities and links) are computed on ingest. See [Retain](/api-reference/retain).
- **Recall** — retrieve memories with a hybrid of semantic, keyword, graph, and temporal search, fused and reranked. See [Recall](/api-reference/recall).
- **Reflect** — generate a synthesized, disposition-aware answer from memories and consolidated observations. See [Reflect](/api-reference/reflect).

## Fact types

Every memory has a `type`. Three are produced automatically; five more are [typed blocks](/concepts/typed-blocks) you write directly:

`world` · `experience` · `observation` · `procedure` · `reasoning` · `preference` · `correction` · `profile`

Recall can filter to any subset via `types`, and default recall (no filter) returns them all — so adopting typed blocks never changes existing behaviour.

## Lifecycle

Memories decay through states — **New → Active → Expiring → Forgotten** — so stale knowledge fades while frequently-used memories stay strong. Corrections and explicit updates reset the relevant memories.
