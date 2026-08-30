# Org & layered memory

Every space has an implicit **organization bank** with the reserved id `__org__:{space}`. It holds knowledge that belongs to the whole team — policies, standards, shared playbooks — rather than to one person.

## Writing to the org bank

Any project key may write to the org bank directly:

```python
cm.retain(bank_id="__org__:acme", content="Company policy: deploy freeze every December.")
cm.retain(bank_id="__org__:acme", content="The org standard database is PostgreSQL 16.")
```

## Layered recall (person + org)

Layered recall blends a person's own memories with their space's org bank. It is **opt-in** and **person-wins-on-conflict** — the person's results rank first, the org's merge in behind them, and duplicates are dropped.

::: code-group
```python [Python]
cm.recall(bank_id="jane@acme.com", query="deploy policy",
          space="acme", include_org=True)
# convenience wrapper:
cm.recall_layered("jane@acme.com", "deploy policy", space="acme")
```
```typescript [TypeScript]
await cm.recall("jane@acme.com", "deploy policy", { space: "acme", includeOrg: true });
// convenience wrapper:
await cm.recallLayered("jane@acme.com", "deploy policy", { space: "acme" });
```
:::

Default recall stays person-only, so nothing changes unless you ask for the blend. The response carries `usage.org_blended = true` when a layered recall ran.

## Managing spaces

```python
cm.create_space("acme", name="Acme Corp")
cm.retain(bank_id="jane@acme.com", content="Jane prefers dark mode", space="acme")
cm.list_space_banks("acme")     # people in the org
```
