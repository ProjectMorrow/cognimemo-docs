# Playground

Try `retain`, `recall`, and `reflect` against the live gateway right here. Paste a
project API key (`cmk_live_…` — mint one in the console under **Connect**), pick an
operation, and hit **Run**. Your key never leaves the browser; requests go straight
from this page to the gateway.

<ClientOnly>
  <Playground />
</ClientOnly>

::: tip Enabling live "Run"
The browser calls the gateway directly, so the gateway must allow this docs origin
via CORS (`GATEWAY_CORS_ORIGINS`). If **Run** is blocked, the request is fine — copy
the **cURL** snippet and run it from your terminal, or add the docs domain to
`GATEWAY_CORS_ORIGINS`. Every field also generates ready-to-paste **Python** and
**TypeScript** SDK snippets below the response.
:::

## The three calls

- **retain** — store a memory. `POST /v1/me/banks/{bank}/memories` with `{ content, space }`.
- **recall** — semantic search over memories. `POST /v1/me/banks/{bank}/memories/recall` with `{ query, max_tokens, budget, space }`. Add `include_org` to blend the space's org memory.
- **reflect** — an LLM answer synthesized from recalled memory. `POST /v1/me/banks/{bank}/reflect` with `{ query, space }`.

Bank IDs are URL-encoded automatically (`jane@acme.com` → `jane%40acme.com`). See the
[API Reference](/api) for every parameter, or the
[SDKs](/sdks/overview) to skip HTTP entirely.
