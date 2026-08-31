# SDKs

Official clients for Cognimemo. Both talk to the [Gateway](/cloud/gateway) with a per-project API key and expose the same surface: retain / recall / reflect, typed blocks, spaces, layered recall, and entities. Encryption at rest is a [project-level console policy](/concepts/encryption), not an SDK call — recall keeps returning plaintext whether it's on or off.

| SDK | Package | Guide |
|-----|---------|-------|
| Python | `cognimemo-client` | [Python SDK](/sdks/python) |
| TypeScript / JS | `@cognimemo/client` | [TypeScript SDK](/sdks/typescript) |

## Install

::: code-group
```bash [Python]
pip install cognimemo-client
```
```bash [TypeScript]
npm install @cognimemo/client
```
:::

## Initialize

::: code-group
```python [Python]
from cognimemo_client import Cognimemo
cm = Cognimemo(base_url="https://api.cognimemo.com", api_key="cmk_live_…")
```
```typescript [TypeScript]
import { CognimemoClient } from "@cognimemo/client";
const cm = new CognimemoClient({ baseUrl: "https://api.cognimemo.com", apiKey: "cmk_live_…" });
```
:::

- **Base URL** — `https://api.cognimemo.com` for hosted Cognimemo (the Gateway), or your own engine URL if self-hosting.
- **API key** — create one in [app.cognimemo.com](https://app.cognimemo.com) → Connect → API Keys.

## Other clients

- **MCP** — connect Claude, Cursor, and other agents without an SDK. See [MCP Server](/mcp/overview).
- **REST** — call the API directly. See the [API Reference](/api).
