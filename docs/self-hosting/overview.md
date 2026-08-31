# Self-hosting

Run the whole memory engine yourself — one container, no external services
required. Same retain / recall / reflect, your infrastructure, your keys.

Self-hosting gives you the **engine** directly. There's no gateway or per-project
API keys to manage; calls use the single-tenant path `/v1/default/…` instead of the
managed `/v1/me/…`.

## Quickstart — one container

The standalone image bundles the engine, an embedded Postgres + pgvector, and a
local (ONNX) embedding model, so it runs with **no API keys and no external
database**:

```bash
docker run -d --name cognimemo \
  -p 8888:8888 \
  -v cognimemo-data:/home/cognimemo/.pg0 \
  ghcr.io/projectmorrow/cognimemo:latest
```

The engine listens on **:8888**. Give it a minute on first boot — it downloads and
warms the embedding model. Then:

```bash
# retain
curl -X POST http://localhost:8888/v1/default/banks/jane%40acme.com/memories \
  -H 'Content-Type: application/json' \
  -d '{"content":"Jane deploys on Fridays.","space":"acme"}'

# recall
curl -X POST http://localhost:8888/v1/default/banks/jane%40acme.com/memories/recall \
  -H 'Content-Type: application/json' \
  -d '{"query":"when does Jane deploy?","space":"acme"}'
```

::: warning Use a named volume
The container runs **rootless** (UID 1000). Bind-mounting a host directory it
doesn't own will fail with a permissions error — use a Docker **named volume**
(`-v cognimemo-data:/home/cognimemo/.pg0`, as above) and the data is owned
correctly and persists across restarts.
:::

## With the SDKs

Point the client at your engine — everything else is identical to the
[managed SDKs](/sdks/overview):

```python
from cognimemo_client import Cognimemo
cm = Cognimemo(base_url="http://localhost:8888")   # self-host engine
cm.retain(bank_id="jane@acme.com", content="Jane deploys on Fridays.", space="acme")
```

## Configuration

All configuration is via environment variables (`-e NAME=value`).

### Database

| Variable | Default | Notes |
|---|---|---|
| `COGNIMEMO_API_DATABASE_URL` | *(embedded pg0)* | Point at your own Postgres (needs the `pgvector` extension). Leave unset to use the built-in embedded database. |

### Embeddings

Local ONNX runs out of the box (no key). To use a hosted provider instead, set one
family of variables:

- **OpenAI-compatible / LiteLLM** — `COGNIMEMO_API_EMBEDDINGS_LITELLM_MODEL`, `…_LITELLM_API_KEY`, `…_LITELLM_API_BASE`
- **Gemini** — `COGNIMEMO_API_EMBEDDINGS_GEMINI_API_KEY`, `…_GEMINI_MODEL`
- **Cohere** — `COGNIMEMO_API_EMBEDDINGS_COHERE_API_KEY`, `…_COHERE_MODEL`
- **Local** — `COGNIMEMO_API_EMBEDDINGS_LOCAL_MODEL` (default), `…_LOCAL_FORCE_CPU`

### LLM (extraction + reflect)

The engine needs an LLM for fact extraction and `reflect`. Configure your provider
(OpenAI, Vertex/Gemini, or any LiteLLM-supported model) via the engine's LLM
settings. Without one, retain still stores content but skips LLM extraction, and
`reflect` is unavailable.

### Encryption at rest

Set a 32-byte master key to encrypt memory bodies at rest — transparent to recall:

```bash
-e COGNIMEMO_API_ENCRYPTION_MASTER_KEY="$(openssl rand -base64 32)"
```

Unset, encryption is a no-op. See [Encryption at rest](/concepts/encryption).

## Managed gateway (optional)

The single container is the engine only. If you want the **multi-tenant gateway**
(per-project API keys, quotas, the `/v1/me/…` path, the console), run the gateway
alongside the engine — it's a separate service (`gateway/Dockerfile`) backed by its
own control-plane Postgres and configured with `GATEWAY_DATABASE_URL`,
`GATEWAY_ADMIN_TOKEN`, and `GATEWAY_CORS_ORIGINS`. For most self-host setups the
engine's single-tenant path is all you need.

## Managed vs self-hosted

| | Managed (`api.cognimemo.com`) | Self-hosted |
|---|---|---|
| Path | `/v1/me/…` | `/v1/default/…` |
| Auth | project key (`cmk_live_…`) | your own (none by default) |
| Database | we run it | embedded pg0 or your Postgres |
| Embeddings / LLM | we provide | your keys / local models |
| Isolation, quotas, console | included | bring the gateway |
