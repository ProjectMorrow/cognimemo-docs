# TypeScript SDK

`@cognimemo/client` — the official TypeScript / JavaScript client.

```bash
npm install @cognimemo/client
```

## Quickstart

```typescript
import { CognimemoClient } from "@cognimemo/client";

const cm = new CognimemoClient({ baseUrl: "https://api.cognimemo.com", apiKey: "cmk_live_…" });

await cm.retain("jane@acme.com", "Jane ships on Fridays.");

const res = await cm.recall("jane@acme.com", "when does Jane ship?");
res.results.forEach((r) => console.log(r.type, r.text, r.scores));

const answer = await cm.reflect("jane@acme.com", "What is Jane's release cadence?");
```

## Data model — space → bank → memories

```typescript
await cm.createSpace("acme", { name: "Acme Corp" });
await cm.retain("jane@acme.com", "Jane prefers dark mode", { space: "acme" });
await cm.recall("jane@acme.com", "what does jane prefer?", { space: "acme" });
await cm.listSpaceBanks("acme");
```

## Typed memory blocks

Each helper stores a distinct **memory type** that's processed and recalled differently
— `procedure` (how a task is done), `reasoning` (why a decision was made), `preference`
(how the user wants things), `correction` (a "no, do it this way" signal), `profile`
(the user's tools/access). See [Memory types & typed blocks](/concepts/typed-blocks)
for what each means and when to use it.

```typescript
await cm.retainPreference("jane@acme.com", "For day-planning, use personal Gmail, never work mail.");
await cm.retainProcedure("jane@acme.com", ["make build", "kubectl apply -f prod.yaml"], { rationale: "prod deploy" });
await cm.retainReasoning("jane@acme.com", "Chose gRPC over REST: p99 latency mattered more.");
await cm.retainCorrection("jane@acme.com", "No — drain the pod before restart.");
await cm.updateProfile("jane@acme.com", "Admin on AWS, GitHub, Grafana.");

// any type directly:
await cm.retain("jane@acme.com", "Acme HQ is in Berlin.", { factType: "world" });

// type-filtered recall:
await cm.recall("jane@acme.com", "how to deploy", { types: ["procedure"] });
```

See [Typed memory blocks](/concepts/typed-blocks) for the full list.

## Layered / org memory

```typescript
await cm.retain("__org__:acme", "Deploy freeze every December.");
await cm.recallLayered("jane@acme.com", "deploy policy", { space: "acme" });
```

## Entities

```typescript
await cm.retain("jane@acme.com", "Jane joined the DeepMind team on Gemini.", {
  entities: [{ text: "Jane", type: "PERSON" }, { text: "Gemini", type: "PROJECT" }],
});

// no-LLM auto-entities for verbatim ingest (off by default):
await cm.updateBankConfig("jane@acme.com", { retainAutoEntities: true });
```

## Encryption at rest

Encryption is a **project-level policy set in the console** (Settings → Security), not an SDK call. When it's on, memories are stored encrypted and the SDK keeps returning plaintext — nothing changes in your code. See [Encryption at rest](/concepts/encryption).

## Recall response

`recall(...)` resolves to a `RecallResponse` with `.results` (each a `RecallResult`) and `.usage`. Each result carries `type`, `text`, `context`, `occurred_start` / `occurred_end` / `mentioned_at`, `entities`, and `scores` (`{ final, semantic, keyword }`). `.usage` includes `tokens_used` and `org_blended` for layered recall.
