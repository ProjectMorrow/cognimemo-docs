# Entities & graph

As memories accumulate, Cognimemo links the **entities** they mention (people, orgs, places, projects, concepts) into a graph. Entities power graph-based recall and the knowledge visualization in the console.

## Where entities come from

1. **Automatic extraction** — when the engine runs with a real LLM, retain extracts and resolves entities for you.
2. **Caller-supplied** — the note-taker model: your agent already knows the entities, so pass them explicitly. They're merged with any the LLM extracts and resolved against the bank's existing entities.

```python
cm.retain(bank_id="jane@acme.com",
    content="Jane joined the DeepMind team on Gemini.",
    entities=[{"text": "Jane", "type": "PERSON"},
              {"text": "DeepMind", "type": "ORG"},
              {"text": "Gemini", "type": "PROJECT"}])

cm.entities.list_entities("jane@acme.com")   # canonicalized, deduped, with mention_count
```

## No-LLM auto-entities (verbatim ingest)

Verbatim (`chunks`) ingest makes no LLM call, so it extracts no entities by default. Turn on lightweight, deterministic proper-noun/acronym extraction so the graph isn't empty:

```python
cm.update_bank_config("jane@acme.com", retain_auto_entities=True)
```

This is **off by default** (recall stays byte-identical) and never overrides caller-supplied entities.

## Resolution

Supplied names are resolved against existing entities by name similarity plus co-occurrence — so `Dr. Waller` and `Dr Waller` become one entity. Pass `resolve_entities=False` to store names exactly as written (an existing entity is reused only on a case-insensitive exact match).
