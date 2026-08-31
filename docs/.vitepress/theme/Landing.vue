<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let raf = 0;

const features = [
  { t: "Retain", d: "Plain content in — typed facts, entities, and temporal structure out. No schema.", to: "/api",
    svg: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>' },
  { t: "Recall", d: "Semantic search across eight fact-types with cross-encoder reranking.", to: "/api",
    svg: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>' },
  { t: "Reflect", d: "An LLM answer synthesized from memory — mental models, not raw hits.", to: "/api",
    svg: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>' },
  { t: "Typed blocks", d: "Procedures, reasoning, preferences, corrections, profiles — first-class.", to: "/concepts/typed-blocks",
    svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
  { t: "Org memory", d: "Space → bank → memories. Layered recall — the person wins on conflict.", to: "/concepts/org-memory",
    svg: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>' },
  { t: "Self-host or managed", d: "One container with an embedded DB, or the hosted gateway. Your call.", to: "/self-hosting/overview",
    svg: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>' },
];

onMounted(() => {
  const c = canvas.value;
  if (!c) return;
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const accent = () =>
    document.documentElement.classList.contains("dark") ? "140,255,46" : "79,191,0";

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  type N = { x: number; y: number; vx: number; vy: number; r: number; p: number };
  let nodes: N[] = [];

  function resize() {
    const rect = c!.getBoundingClientRect();
    w = rect.width; h = rect.height;
    c!.width = w * dpr; c!.height = h * dpr;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(18, Math.min(46, Math.floor((w * h) / 26000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.8 + 1.2, p: Math.random() * Math.PI * 2,
    }));
  }

  function frame() {
    const rgb = accent();
    ctx!.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy; n.p += 0.02;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    // edges — the "memory links"
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          ctx!.strokeStyle = `rgba(${rgb},${(1 - dist / 150) * 0.18})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
        }
      }
    }
    // nodes — the "memories", gently pulsing
    for (const n of nodes) {
      const pulse = (Math.sin(n.p) + 1) / 2;
      ctx!.fillStyle = `rgba(${rgb},${0.35 + pulse * 0.4})`;
      ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r + pulse * 0.8, 0, Math.PI * 2); ctx!.fill();
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  resize();
  frame();
  if (reduce) frame(); // one static paint
  const onResize = () => { resize(); if (reduce) frame(); };
  window.addEventListener("resize", onResize);
  onBeforeUnmount(() => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); });
});
</script>

<template>
  <div class="lp">
    <section class="lp-hero">
      <canvas ref="canvas" class="lp-canvas" aria-hidden="true"></canvas>
      <div class="lp-hero-inner">
        <div class="lp-eyebrow">RETAIN · RECALL · REFLECT</div>
        <h1 class="lp-title">The memory layer<br />your agents remember with</h1>
        <p class="lp-sub">
          Persistent, queryable memory for AI agents. Cross-encoder recall, typed memory
          blocks, per-project isolation — hosted, or self-hosted in one container.
        </p>
        <div class="lp-cta">
          <a class="lp-btn lp-btn-brand" href="/getting-started/quickstart">Quickstart</a>
          <a class="lp-btn" href="/playground">Playground</a>
          <a class="lp-btn" href="/api">API Reference</a>
        </div>
        <div class="lp-code">
          <div class="lp-code-bar"><span></span><span></span><span></span><em>python</em></div>
<pre><code><span class="c-k">from</span> cognimemo_client <span class="c-k">import</span> Cognimemo
cm = <span class="c-f">Cognimemo</span>(api_key=<span class="c-s">"cmk_live_…"</span>)

cm.<span class="c-f">retain</span>(<span class="c-s">"jane@acme.com"</span>, <span class="c-s">"Jane deploys on Fridays."</span>)
cm.<span class="c-f">recall</span>(<span class="c-s">"jane@acme.com"</span>, <span class="c-s">"when does Jane deploy?"</span>)</code></pre>
        </div>
      </div>
    </section>

    <section class="lp-features">
      <a v-for="f in features" :key="f.t" class="lp-card" :href="f.to">
        <span class="lp-ic" v-html="`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${f.svg}</svg>`"></span>
        <h3>{{ f.t }}</h3>
        <p>{{ f.d }}</p>
      </a>
    </section>
  </div>
</template>

<style scoped>
.lp { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.lp-hero { position: relative; padding: 76px 0 40px; overflow: hidden; }
.lp-canvas {
  position: absolute; inset: -1px; width: 100%; height: 100%;
  z-index: 0; opacity: 0.85;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 35%, #000 55%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 35%, #000 55%, transparent 100%);
}
.lp-hero-inner { position: relative; z-index: 1; text-align: center; }
.lp-eyebrow {
  font-family: var(--vp-font-family-mono); font-size: 12px; letter-spacing: 0.28em;
  color: var(--vp-c-brand-1); font-weight: 600; margin-bottom: 20px;
}
.lp-title {
  font-size: clamp(34px, 6vw, 62px); line-height: 1.05; font-weight: 800;
  letter-spacing: -0.03em; margin: 0 auto; max-width: 16ch; text-wrap: balance;
  background: linear-gradient(180deg, var(--vp-c-text-1), color-mix(in srgb, var(--vp-c-text-1) 62%, var(--vp-c-brand-3)));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.lp-sub {
  margin: 22px auto 0; max-width: 60ch; font-size: 17px; line-height: 1.6;
  color: var(--vp-c-text-2);
}
.lp-cta { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 30px; }
.lp-btn {
  padding: 11px 22px; border-radius: 10px; font-weight: 600; font-size: 14.5px;
  border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-1);
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}
.lp-btn:hover { transform: translateY(-2px); border-color: var(--vp-c-brand-3); }
.lp-btn-brand { background: var(--vp-c-brand-3); color: #0A2A02; border-color: var(--vp-c-brand-3); }
.lp-btn-brand:hover { filter: brightness(1.05); }
.lp-code {
  margin: 44px auto 0; max-width: 620px; text-align: left;
  border: 1px solid var(--vp-c-divider); border-radius: 14px; overflow: hidden;
  background: var(--vp-c-bg-alt); box-shadow: 0 20px 60px -30px var(--vp-c-brand-soft);
}
.lp-code-bar {
  display: flex; align-items: center; gap: 7px; padding: 11px 14px;
  border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
}
.lp-code-bar span { width: 10px; height: 10px; border-radius: 50%; background: var(--vp-c-divider); }
.lp-code-bar em { margin-left: auto; font-style: normal; font-family: var(--vp-font-family-mono); font-size: 11.5px; color: var(--vp-c-text-3); }
.lp-code pre { margin: 0; padding: 16px 18px; overflow-x: auto; }
.lp-code code { font-family: var(--vp-font-family-mono); font-size: 13px; line-height: 1.7; color: var(--vp-c-text-1); }
.c-k { color: var(--vp-c-brand-1); } .c-f { color: var(--vp-c-brand-2); } .c-s { color: var(--vp-c-text-3); }

.lp-features {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  margin: 30px 0 70px;
}
.lp-card {
  display: block; padding: 22px; border-radius: 14px; border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft); transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.lp-card:hover { border-color: var(--vp-c-brand-3); transform: translateY(-3px); box-shadow: 0 14px 34px -18px var(--vp-c-brand-soft); }
.lp-ic {
  display: inline-flex; padding: 9px; border-radius: 10px;
  background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1);
}
.lp-ic :deep(svg) { width: 22px; height: 22px; }
.lp-card h3 { margin: 14px 0 6px; font-size: 16px; font-weight: 700; letter-spacing: -0.01em; color: var(--vp-c-text-1); }
.lp-card p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--vp-c-text-2); }
@media (max-width: 900px) { .lp-features { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) { .lp-features { grid-template-columns: 1fr; } }
</style>
