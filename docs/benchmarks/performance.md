# Performance & accuracy

Honest, reproducible numbers for Cognimemo's managed cloud (`api.cognimemo.com`).
We publish the methodology and caveats alongside every figure — a memory system is
only worth what you can verify.

## Retrieval accuracy — LoCoMo

[LoCoMo](https://github.com/snap-research/locomo) is a long-conversation memory
benchmark. We ingest a full multi-session conversation, then ask questions that
require finding the right fact across the history.

**Protocol.** The system does *retrieval* (`recall`); an LLM reads the recalled
context and answers; answers are graded against the gold answer for semantic
correctness. This is the standard memory-benchmark setup — it measures the whole
pipeline (extraction → retrieval → reading).

**Result — 60 questions, balanced across categories, one conversation (419 turns):**

| Category | Accuracy |
|---|---|
| Open-domain (inference) | 100% |
| Adversarial (abstention) | 92% |
| Multi-hop | 83% |
| Single-hop | 75% |
| Temporal | 50% → *being improved* |
| **Overall** | **80%** |

**What we're honest about:**

- This is a **60-question balanced slice of one conversation**, not the full
  1,986-question set — a solid signal, not a headline leaderboard number.
- Grading was done by a capable LLM reader/judge, not the paper's exact GPT-4-judge
  harness. We don't claim to beat any specific competitor without a full run under
  an independent judge.
- **Temporal (50%) is the known weak spot**, and it's specific: the extractor
  captured *what* happened but sometimes kept relative dates ("last week") without
  resolving them to absolute dates. This is being fixed by anchoring every relative
  expression to the message timestamp at extraction time.

## Latency

Client-observed, end-to-end through the managed gateway (includes network,
embeddings, retrieval, and — for reflect — generation). Measured warm against
production.

| Operation | p50 (warm) | What it does |
|---|---|---|
| **recall** | **~300ms** | multi-fact-type retrieval → RRF → cross-encoder rerank |
| **reflect** | **~300ms** | LLM answer from recalled memory (normal queries) |
| **retain** | **sub-second** async · ~1.5–2s sync | embed + LLM fact extraction |

**Reading these honestly:**

- **`recall` (~300ms) is the hot path** — fast enough to inject memory on every agent
  turn, and it stays flat as memory grows (a 3-fact bank and a 400-turn bank both land
  ~300ms).
- **`reflect` (~300ms)** for normal queries. Deep multi-step *agentic* synthesis over a
  large bank can take several seconds — that's the exception, not the per-turn path.
- **`retain` is sub-second** with `retain_async` (returns immediately; extraction runs
  in the background) or in verbatim mode. Synchronous retain waits for LLM fact
  extraction (~1.5–2s) — the one place we deliberately spend time, at write, so reads
  stay cheap.

The read path — `recall` and `reflect` — is **sub-second**, which is what matters for
real-time agents.

::: tip Getting the low latency
`recall` latency is dominated by two things you control: **caller region** (put your
agent in the same region as the deployment) and **sustained load on burstable
instances** (a steady request rate on a shared CPU throttles — a compute/GPU node
holds the ~300ms under load). Isolated warm calls are already sub-second.
:::

## Reproduce it

The harness lives in the backend repo (`benchmarks/agenteval`) and runs LoCoMo or
LongMemEval end-to-end against any deployment with two env vars
(`COGNIMEMO_BASE_URL`, `COGNIMEMO_API_KEY`). It sizes each run to your plan quota with
a pre-flight check, so a free-tier account can run a real (smaller) slice without
hitting limits.
