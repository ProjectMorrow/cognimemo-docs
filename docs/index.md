---
layout: home
hero:
  name: "Cognimemo"
  text: "Memory for AI agents"
  tagline: "Retain, recall, reflect — persistent, queryable memory your agents carry across every conversation. Cross-encoder recall, typed memory blocks, per-project isolation."
  image:
    src: /brand/cognimemo-icon.png
    alt: Cognimemo
  actions:
    - theme: brand
      text: Quickstart
      link: /getting-started/quickstart
    - theme: alt
      text: Try the Playground
      link: /playground
    - theme: alt
      text: SDKs
      link: /sdks/overview
features:
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' }
    title: Retain
    details: Store memories as text, files, or URLs. The engine extracts typed facts, entities, and temporal structure — no schema to design.
    link: /api-reference/retain
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' }
    title: Recall
    details: Semantic search across eight fact-types with cross-encoder reranking. Blend a person's memory with shared org memory in one call.
    link: /api-reference/recall
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>' }
    title: Reflect
    details: An LLM answer synthesized from recalled memory — mental models and directives, not just raw hits.
    link: /api-reference/reflect
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' }
    title: Typed memory blocks
    details: Procedures, reasoning, preferences, corrections, profiles — first-class block types with their own recall filters and decay.
    link: /concepts/typed-blocks
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/></svg>' }
    title: Spaces & org memory
    details: Space → bank → memories. Layered recall lets the org brain answer while the person wins on conflict.
    link: /concepts/org-memory
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' }
    title: Encryption at rest
    details: AES-256-GCM for memory bodies, a project-level console toggle. Recall stays plaintext — nothing changes in your code.
    link: /concepts/encryption
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>' }
    title: MCP-native
    details: Connect Cognimemo to Claude, Cursor, and any MCP client — retain and recall as tools, no glue code.
    link: /mcp/overview
  - icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' }
    title: Measured, not marketed
    details: Public LoCoMo accuracy and latency numbers, honestly caveated. Verify before you trust.
    link: /benchmarks/performance
---
