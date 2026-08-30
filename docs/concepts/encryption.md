# Encryption at rest

Cognimemo can encrypt memory bodies at rest with **AES-256-GCM** using a server-held master key. It's **opt-in per bank**, and completely transparent to your code — recall and reflect always return plaintext.

## How it works

- **Write:** memory `text` and `context` are encrypted *after* embeddings are computed from plaintext, so semantic recall is unaffected. Ciphertext is self-describing (`enc:v1:<nonce>:<ct>`).
- **Read:** recall / reflect / list decrypt transparently. A bank can hold a mix of older plaintext and newer encrypted rows — every read still works (lazy migration).
- **Key:** a single operator-held master key, `COGNIMEMO_API_ENCRYPTION_MASTER_KEY`. When it's unset, encryption is a no-op everywhere.

Honest posture: this is **encryption at rest**, not end-to-end — Cognimemo holds the key. The guarantee is that memory bodies are unreadable at rest without it.

## Turning it on

```python
cm.enable_encryption("jane@acme.com")     # sets bank config encryption="managed"
# ...retain / recall exactly as before — you always get plaintext back...
cm.disable_encryption("jane@acme.com")    # stop encrypting NEW memories
```

```typescript
await cm.enableEncryption("jane@acme.com");
```

Requires the operator to have set the master key on the server. Existing plaintext rows stay readable; new memories are stored encrypted.

## Scope (v1)

Encrypted: `memory_units.text` and `.context`. Not yet covered: chunk/document original text and keyword-search lexemes. Entity names and mental-model descriptions remain plaintext so graph and search keep working.
