# Typed memory blocks

Beyond the auto-extracted `world` / `experience` / `observation` facts, you can store five **first-class typed blocks** directly. Each is a `fact_type` and is retrievable with the matching `types` filter on recall.

| Block | Holds | Written by |
|-------|-------|------------|
| `procedure` | How a task was done — distilled steps + rationale | the agent, at save time |
| `reasoning` | Why a decision was made on a task | the agent, per task |
| `preference` | A conditional rule ("for day-planning, use personal Gmail") | corrections + explicit statements |
| `correction` | A raw "no, do it this way" signal (highest-signal) | user or agent |
| `profile` | The apps/tools/access a user has | verified on use |

## Storing a typed block

Typed blocks are stored **verbatim** (no LLM rewrite), so put the bank in `chunks` mode first — the SDK helpers do this for you.

::: code-group
```python [Python]
cm.retain_procedure("jane@acme.com",
    ["make build", "kubectl apply -f prod.yaml", "curl /health"],
    rationale="standard prod deploy")
cm.retain_reasoning("jane@acme.com", "Chose gRPC over REST: p99 latency mattered more.")
cm.retain_preference("jane@acme.com", "For day-planning, use personal Gmail, never work mail.")
cm.retain_correction("jane@acme.com", "No — drain the pod before restart.")
cm.update_profile("jane@acme.com", "Has admin on AWS, GitHub, and Grafana.")

# or set the type directly on retain:
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
:::

## Recalling by type

```python
# Only procedures
cm.recall("jane@acme.com", "how do I deploy?", types=["procedure"])
# Preferences + corrections
cm.recall("jane@acme.com", "how should I handle this?", types=["preference", "correction"])
# Everything (default)
cm.recall("jane@acme.com", "deploy")
```

## The correction loop

Corrections are the highest-signal input — store them raw as they happen. A consolidation pass distills repeated or explicit corrections into `preference` blocks (and, when a correction targets a procedure step, into a repair on that procedure). Conflict rule: **explicit correction > repeated pattern > one-off inference**, recency-tiebroken.
