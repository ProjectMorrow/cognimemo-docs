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
extraction/embeddings, the full multi-arm retrieval + cross-encoder rerank, and
generation). Your numbers vary with region and payload size.

| Operation | p50 | p95 | What it does |
|---|---|---|---|
| **retain** | ~1.4s | ~3.8s | embed + LLM fact extraction |
| **recall** | ~7.5s | ~8.8s | multi-fact-type retrieval → RRF → cross-encoder rerank → entities |
| **reflect** | ~30s | ~99s | agentic multi-step synthesis over recalled memory |

**Reading these honestly:**

- **`retain` is fast enough to sit inline** in an agent turn.
- **`recall` (~7.5s)** reflects the full managed pipeline, not raw vector lookup. If
  you need lower latency, narrow the fact-types you query or lower the recall
  `budget` — and expect this to come down as we tune the rerank stage.
- **`reflect` is a synthesis call, not a hot-path lookup.** Use `recall` for
  interactive per-turn memory injection and reserve `reflect` for on-demand summaries.

## Reproduce it

The harness lives in the backend repo (`benchmarks/agenteval`) and runs LoCoMo or
LongMemEval end-to-end against any deployment with two env vars
(`COGNIMEMO_BASE_URL`, `COGNIMEMO_API_KEY`). It sizes each run to your plan quota with
a pre-flight check, so a free-tier account can run a real (smaller) slice without
hitting limits.
