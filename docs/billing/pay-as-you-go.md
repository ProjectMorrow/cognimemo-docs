# Pay-as-you-go

Pay-as-you-go lets usage exceed your plan's monthly quota instead of hard-failing at the limit. When enabled, overage is metered and billed per operation.

## Rates

| Operation | Overage price |
|-----------|---------------|
| Memory retained | $0.01 each |
| Recall | $0.01 each |
| Reflect | $0.05 each |

Usage *within* your plan's quota is always included — overage rates apply only beyond it. See [Plans & Pricing](/billing/plans) for included quotas.

## How metering works

Every billable operation records a usage event with its operation type, the bank/space, and a token estimate — the same numbers you see in **Settings → Usage**. Recall responses also return a `usage` object (`tokens_used`, `max_tokens`, `truncated`) so you can track cost client-side.

## Enabling / disabling

Toggle pay-as-you-go in **Settings → Billing**:

- **Off (default):** requests that exceed your quota return `429 Too Many Requests`. Upgrade your plan or wait for the monthly reset.
- **On:** requests continue past the quota and overage is added to your next invoice.

## Rate limits vs quotas

- **Quota** — total operations per month (per plan). Overage is where pay-as-you-go applies.
- **Rate limit** — requests per minute (per plan). This is a burst guard and is **not** affected by pay-as-you-go; a `429` from the rate limit means slow down, not "out of quota."
