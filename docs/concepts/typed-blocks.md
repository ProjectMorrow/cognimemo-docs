# Memory types & typed blocks

Not all memory is the same. A fact about the user ("Acme HQ is in Berlin") behaves
nothing like *how to deploy the billing service* or *"no — drain the pod first."*
Cognimemo gives each kind of memory a **`fact_type`** so it's stored, distilled, and
recalled in the way that kind deserves.

The guiding model: **Cognimemo is the note-taker; your agent is the intelligence.**
The agent does the work and tells us what happened; next time it asks, we hand back
exactly the right notes.

There are **eight** types, in two families.

## Family 1 — auto-extracted (Cognimemo writes these for you)

You send plain content to `retain`; the engine extracts these.

### `world`
**What:** objective facts about the user and their world — "Jane owns the billing
service," "Acme HQ is in Berlin."
**Why:** the backbone of memory — what's true, independent of who said it.
**Processed:** the LLM reads your content and extracts facts + entities + temporal
structure. **Recalled:** by default; the bread-and-butter of recall.

### `experience`
**What:** the **agent's own first-person episodes** — "I deployed billing on Friday
and rolled back once."
**Why:** so the agent remembers what *it* did, not just facts about the user.
**Processed:** LLM-extracted, tagged as assistant-perspective. **Recalled:** by default.

### `observation`
**What:** higher-level summaries Cognimemo **generates itself** by consolidating raw
facts over time — "Jane consistently ships on Fridays."
**Why:** condensed, durable context instead of 50 raw facts.
**Processed:** written by the **consolidation pass**, not by you. **Recalled:** by
default; prefer these for a compact answer (`prefer_observations`).

## Family 2 — typed blocks (you / the agent write these directly)

Set `fact_type` (or use the SDK helper) and Cognimemo stores the block **verbatim** —
no LLM rewrite. You distill at save-time; we keep the clean block and still compute
embeddings so semantic recall works. These are what make an agent *get better at a
task over time*.

### `procedure`
**What:** how a task was actually done — distilled steps + rationale (e.g. `make build`
→ `kubectl apply -f prod.yaml` → `curl /health`).
**Why:** so the agent can **replay** a known-good task instead of re-figuring it out.
The agent owns execution and repair; we store the clean recipe (and new versions when
it repairs one). **Recalled:** `types=["procedure"]` when the agent is about to act.

### `reasoning`
**What:** *why* a decision was made — "chose gRPC over REST: p99 latency mattered."
**Why:** so the next decision doesn't re-derive the same trade-off from scratch.
**Recalled:** `types=["reasoning"]` when weighing a similar choice.

### `preference`
**What:** a conditional rule for how the user wants things — "for day-planning, use my
personal Gmail, never work mail."
**Why:** durable "how," not "what." The highest-value block for acting *the way the
user wants*. Formed from explicit statements **and** distilled corrections.
**Recalled:** almost always worth including.

### `correction`
**What:** the raw, in-the-moment "no — do it this way" signal. The **highest-signal**
feedback there is.
**Why:** capture it exactly as it happens; it's both an immediate override and training
data. **Processed:** stored raw; the consolidation pass distills repeated/explicit
corrections into `preference` blocks (and, when a correction targets a procedure step,
into a repair on that procedure). **Conflict rule:** explicit correction > repeated
pattern > one-off inference, recency-tiebroken.

### `profile`
**What:** the user's tools, apps, access, and normal patterns — "has admin on AWS,
GitHub, and Grafana."
**Why:** lets the agent **match a procedure safely** — don't propose a tool the user
can't touch. **Recalled:** when planning what the agent is even able to do.

## How they differ, at a glance

| Type | Family | Who writes it | Stored | Typical recall |
|---|---|---|---|---|
| `world` | extracted | engine (LLM) | distilled fact | default |
| `experience` | extracted | engine (LLM) | distilled fact | default |
| `observation` | consolidated | engine | rolled-up summary | default / `prefer_observations` |
| `procedure` | typed block | agent | verbatim | `types:["procedure"]` |
| `reasoning` | typed block | agent | verbatim | `types:["reasoning"]` |
| `preference` | typed block | agent + corrections | verbatim | almost always |
| `correction` | typed block | user/agent | verbatim → distilled | `types:["correction"]` |
| `profile` | typed block | agent (verified on use) | verbatim | when planning actions |

All types share the same recall pipeline (vector retrieval → cross-encoder rerank →
recency-weighted scoring). `fact_type` decides *what gets written and how*; the
`types` filter decides *what comes back*.

## Writing typed blocks

```python [Python]
cm.retain_procedure("jane@acme.com",
    ["make build", "kubectl apply -f prod.yaml", "curl /health"],
    rationale="standard prod deploy")
cm.retain_reasoning("jane@acme.com", "Chose gRPC over REST: p99 latency mattered more.")
cm.retain_preference("jane@acme.com", "For day-planning, use personal Gmail, never work mail.")
cm.retain_correction("jane@acme.com", "No — drain the pod before restart.")
cm.update_profile("jane@acme.com", "Has admin on AWS, GitHub, and Grafana.")

# …or set the type directly on retain:
cm.retain(bank_id="jane@acme.com", content="Acme HQ is in Berlin.", fact_type="world")
```
```typescript [TypeScript]
await cm.retainProcedure("jane@acme.com",
    ["make build", "kubectl apply -f prod.yaml", "curl /health"],
    { rationale: "standard prod deploy" });
await cm.retainReasoning("jane@acme.com", "Chose gRPC over REST: p99 latency mattered more.");
await cm.retainPreference("jane@acme.com", "For day-planning, use personal Gmail, never work mail.");
await cm.retainCorrection("jane@acme.com", "No — drain the pod before restart.");
await cm.updateProfile("jane@acme.com", "Has admin on AWS, GitHub, and Grafana.");

await cm.retain("jane@acme.com", "Acme HQ is in Berlin.", { factType: "world" });
```

## Recalling by type

```python
cm.recall("jane@acme.com", "how do I deploy?", types=["procedure"])          # only procedures
cm.recall("jane@acme.com", "how should I handle this?",
          types=["preference", "correction"])                                # rules + overrides
cm.recall("jane@acme.com", "deploy")                                         # all types (default)
```

## The correction loop

Corrections are the highest-signal input, so store them raw the moment they happen. A
consolidation pass then distills repeated or explicit corrections into `preference`
blocks — and, when a correction targets a procedure step, into a repair on that
procedure. That's how an agent stops repeating the same mistake: `correction` today
becomes `preference` (or a fixed `procedure`) tomorrow.
