# Encryption at rest

Cognimemo can encrypt memory bodies at rest with **AES-256-GCM** using a server-held master key. It's a **project-level security policy** you turn on in the console — completely transparent to your code, since recall and reflect always return plaintext.

## How it works

- **Write:** memory `text` and `context` are encrypted *after* embeddings are computed from plaintext, so semantic recall is unaffected. Ciphertext is self-describing (`enc:v1:<nonce>:<ct>`).
- **Read:** recall / reflect / list decrypt transparently. A bank can hold a mix of older plaintext and newer encrypted rows — every read still works (lazy migration).
- **Key:** a single operator-held master key (`COGNIMEMO_API_ENCRYPTION_MASTER_KEY`). When it's unset, encryption is a no-op everywhere.

Honest posture: this is **encryption at rest**, not end-to-end — Cognimemo holds the key. The guarantee is that memory bodies are unreadable at rest without it.

## Turning it on

Encryption is managed in the **console**, not the SDK — it's an org-wide security decision, not a per-call concern:

**Settings → Security → Encryption at rest → toggle on.**

Once on, every memory in the project is stored encrypted going forward, and existing plaintext memories stay readable (lazy migration). Nothing in your SDK/MCP/API code changes — you always get plaintext back.

> Requires the operator to have set the master key on the server. Until then the toggle is inert.

## Scope (v1)

Encrypted: `memory_units.text` and `.context`. Not yet covered: chunk/document original text and keyword-search lexemes. Entity names and mental-model descriptions remain plaintext so graph and search keep working.
