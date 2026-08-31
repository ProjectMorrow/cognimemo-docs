<script setup lang="ts">
import { ref, computed, reactive } from "vue";

type Op = "retain" | "recall" | "reflect";

const state = reactive({
  baseUrl: "https://api.cognimemo.com",
  apiKey: "",
  op: "recall" as Op,
  bankId: "jane@acme.com",
  space: "acme",
  content: "Jane prefers deploys on Fridays and owns the billing service.",
  query: "when does Jane deploy?",
  maxTokens: 1024,
  budget: "mid",
  includeOrg: false,
});

const loading = ref(false);
const error = ref("");
const result = ref<any>(null);
const elapsed = ref(0);
const snippetTab = ref<"curl" | "python" | "typescript">("curl");
const copied = ref("");

const encBank = computed(() => encodeURIComponent(state.bankId.trim()));
const path = computed(() => {
  if (state.op === "retain") return `/v1/me/banks/${encBank.value}/memories`;
  if (state.op === "recall") return `/v1/me/banks/${encBank.value}/memories/recall`;
  return `/v1/me/banks/${encBank.value}/reflect`;
});
const url = computed(() => state.baseUrl.replace(/\/$/, "") + path.value);

const body = computed<Record<string, any>>(() => {
  const space = state.space.trim() || undefined;
  if (state.op === "retain") return { content: state.content, space };
  if (state.op === "recall")
    return {
      query: state.query,
      max_tokens: Number(state.maxTokens) || 1024,
      budget: state.budget,
      space,
      ...(state.includeOrg ? { include_org: true } : {}),
    };
  return { query: state.query, space };
});

const prettyBody = computed(() => JSON.stringify(body.value, null, 2));

async function run() {
  error.value = "";
  result.value = null;
  if (!state.apiKey.trim()) {
    error.value = "Add a project API key (cmk_live_…) — mint one in the console under Connect.";
    return;
  }
  loading.value = true;
  const t0 = performance.now();
  try {
    const res = await fetch(url.value, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.value),
    });
    elapsed.value = Math.round(performance.now() - t0);
    const text = await res.text();
    let parsed: any = text;
    try { parsed = JSON.parse(text); } catch {}
    if (!res.ok) {
      error.value = `HTTP ${res.status} — ${typeof parsed === "string" ? parsed : JSON.stringify(parsed)}`;
    } else {
      result.value = parsed;
    }
  } catch (e: any) {
    elapsed.value = Math.round(performance.now() - t0);
    // A browser CORS/network failure surfaces as an opaque TypeError.
    error.value =
      "Request blocked by the browser (CORS or network). The docs origin isn't in the gateway's allowed origins yet — " +
      "add it to GATEWAY_CORS_ORIGINS on the gateway, or run the cURL snippet below from your terminal.";
  } finally {
    loading.value = false;
  }
}

const curlSnippet = computed(() =>
  `curl -X POST '${url.value}' \\\n` +
  `  -H 'Authorization: Bearer ${state.apiKey.trim() || "cmk_live_…"}' \\\n` +
  `  -H 'Content-Type: application/json' \\\n` +
  `  -d '${JSON.stringify(body.value)}'`
);

const pySnippet = computed(() => {
  const b = state.bankId, s = state.space;
  if (state.op === "retain")
    return `from cognimemo_client import Cognimemo\n\ncm = Cognimemo(base_url="${state.baseUrl}", api_key="cmk_live_…")\ncm.retain(bank_id="${b}", content=${JSON.stringify(state.content)}, space="${s}")`;
  if (state.op === "recall")
    return `from cognimemo_client import Cognimemo\n\ncm = Cognimemo(base_url="${state.baseUrl}", api_key="cmk_live_…")\nr = cm.recall(bank_id="${b}", query=${JSON.stringify(state.query)}, space="${s}", max_tokens=${Number(state.maxTokens) || 1024}${state.includeOrg ? ", include_org=True" : ""})\nfor f in r.results:\n    print(f.text)`;
  return `from cognimemo_client import Cognimemo\n\ncm = Cognimemo(base_url="${state.baseUrl}", api_key="cmk_live_…")\nprint(cm.reflect(bank_id="${b}", query=${JSON.stringify(state.query)}, space="${s}").text)`;
});

const tsSnippet = computed(() => {
  const b = state.bankId, s = state.space;
  if (state.op === "retain")
    return `import { Cognimemo } from "@cognimemo/client";\n\nconst cm = new Cognimemo({ baseUrl: "${state.baseUrl}", apiKey: "cmk_live_…" });\nawait cm.retain("${b}", ${JSON.stringify(state.content)}, { space: "${s}" });`;
  if (state.op === "recall")
    return `import { Cognimemo } from "@cognimemo/client";\n\nconst cm = new Cognimemo({ baseUrl: "${state.baseUrl}", apiKey: "cmk_live_…" });\nconst r = await cm.recall("${b}", ${JSON.stringify(state.query)}, { space: "${s}", maxTokens: ${Number(state.maxTokens) || 1024}${state.includeOrg ? ", includeOrg: true" : ""} });\nr.results.forEach(f => console.log(f.text));`;
  return `import { Cognimemo } from "@cognimemo/client";\n\nconst cm = new Cognimemo({ baseUrl: "${state.baseUrl}", apiKey: "cmk_live_…" });\nconsole.log((await cm.reflect("${b}", ${JSON.stringify(state.query)}, { space: "${s}" })).text);`;
});

const activeSnippet = computed(() =>
  snippetTab.value === "curl" ? curlSnippet.value :
  snippetTab.value === "python" ? pySnippet.value : tsSnippet.value
);

async function copy(text: string, which: string) {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = which;
    setTimeout(() => (copied.value = ""), 1200);
  } catch {}
}
</script>

<template>
  <div class="pg">
    <div class="pg-grid">
      <label class="pg-field pg-span2">
        <span>Base URL</span>
        <input v-model="state.baseUrl" spellcheck="false" />
      </label>
      <label class="pg-field pg-span2">
        <span>API key <em>(cmk_live_… — stays in your browser)</em></span>
        <input v-model="state.apiKey" type="password" placeholder="cmk_live_…" spellcheck="false" />
      </label>

      <label class="pg-field">
        <span>Operation</span>
        <select v-model="state.op">
          <option value="retain">retain</option>
          <option value="recall">recall</option>
          <option value="reflect">reflect</option>
        </select>
      </label>
      <label class="pg-field">
        <span>Bank ID</span>
        <input v-model="state.bankId" spellcheck="false" />
      </label>
      <label class="pg-field">
        <span>Space</span>
        <input v-model="state.space" spellcheck="false" />
      </label>
      <label class="pg-field" v-if="state.op === 'recall'">
        <span>Max tokens</span>
        <input v-model="state.maxTokens" type="number" min="64" />
      </label>

      <label class="pg-field pg-span2" v-if="state.op === 'retain'">
        <span>Content</span>
        <textarea v-model="state.content" rows="2"></textarea>
      </label>
      <label class="pg-field pg-span2" v-else>
        <span>Query</span>
        <textarea v-model="state.query" rows="2"></textarea>
      </label>

      <label class="pg-check pg-span2" v-if="state.op === 'recall'">
        <input type="checkbox" v-model="state.includeOrg" />
        <span>Blend the space's org memory (<code>include_org</code>) — person wins on conflict</span>
      </label>
    </div>

    <div class="pg-run">
      <button class="pg-btn" :disabled="loading" @click="run">
        {{ loading ? "Running…" : `Run ${state.op}` }}
      </button>
      <code class="pg-endpoint">POST {{ path }}</code>
      <span v-if="elapsed && !loading" class="pg-ms">{{ elapsed }} ms</span>
    </div>

    <div v-if="error" class="pg-error">{{ error }}</div>

    <div v-if="result" class="pg-out">
      <div class="pg-out-head">Response</div>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>

    <div class="pg-snip">
      <div class="pg-tabs">
        <button v-for="t in (['curl','python','typescript'] as const)" :key="t"
                :class="{ on: snippetTab === t }" @click="snippetTab = t">{{ t }}</button>
        <button class="pg-copy" @click="copy(activeSnippet, 'snip')">
          {{ copied === 'snip' ? "copied ✓" : "copy" }}
        </button>
      </div>
      <pre>{{ activeSnippet }}</pre>
    </div>
  </div>
</template>

<style scoped>
.pg {
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 18px;
  background: var(--vp-c-bg-soft);
  margin: 20px 0;
}
.pg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pg-span2 { grid-column: 1 / -1; }
.pg-field { display: flex; flex-direction: column; gap: 5px; font-size: 13px; }
.pg-field > span { color: var(--vp-c-text-2); font-weight: 600; }
.pg-field em { color: var(--vp-c-text-3); font-weight: 400; font-style: normal; }
.pg-field input, .pg-field select, .pg-field textarea {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: var(--vp-font-family-base);
  width: 100%;
}
.pg-field textarea { font-family: var(--vp-font-family-mono); font-size: 13px; resize: vertical; }
.pg-field input:focus, .pg-field select:focus, .pg-field textarea:focus {
  outline: none; border-color: var(--vp-c-brand-3);
}
.pg-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--vp-c-text-2); }
.pg-check input { width: 15px; height: 15px; accent-color: var(--vp-c-brand-3); }
.pg-run { display: flex; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
.pg-btn {
  background: var(--vp-c-brand-3); color: #0A2A02;
  border: 0; border-radius: 9px; padding: 9px 18px;
  font-weight: 700; font-size: 14px; cursor: pointer;
}
.pg-btn:disabled { opacity: 0.6; cursor: default; }
.pg-endpoint { font-size: 12.5px; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); }
.pg-ms { font-size: 12px; color: var(--vp-c-text-3); font-variant-numeric: tabular-nums; }
.pg-error {
  margin-top: 14px; padding: 11px 13px; border-radius: 9px; font-size: 13px;
  background: rgba(220, 60, 60, 0.1); border: 1px solid rgba(220, 60, 60, 0.3);
  color: var(--vp-c-text-1);
}
.pg-out { margin-top: 14px; }
.pg-out-head, .pg-tabs { font-size: 12px; font-weight: 700; color: var(--vp-c-text-2); text-transform: uppercase; letter-spacing: 0.04em; }
.pg-out pre, .pg-snip pre {
  margin-top: 8px; background: var(--vp-c-bg-alt); border: 1px solid var(--vp-c-divider);
  border-radius: 9px; padding: 12px; overflow-x: auto; font-size: 12.5px;
  font-family: var(--vp-font-family-mono); max-height: 340px;
}
.pg-snip { margin-top: 18px; }
.pg-tabs { display: flex; gap: 6px; align-items: center; }
.pg-tabs button {
  background: transparent; border: 1px solid var(--vp-c-divider); border-radius: 7px;
  padding: 4px 11px; font-size: 12px; cursor: pointer; color: var(--vp-c-text-2);
  text-transform: none; letter-spacing: 0; font-weight: 500;
}
.pg-tabs button.on { border-color: var(--vp-c-brand-3); color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.pg-copy { margin-left: auto; }
@media (max-width: 640px) { .pg-grid { grid-template-columns: 1fr; } }
</style>
