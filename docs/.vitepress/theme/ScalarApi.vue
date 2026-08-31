<script setup lang="ts">
import { onMounted, ref } from "vue";

const host = ref<HTMLElement | null>(null);

const configuration = {
  theme: "default",
  layout: "modern",
  hideDarkModeToggle: true,
  metaData: { title: "Cognimemo API" },
  customCss: `
    :root, .light, .dark {
      --scalar-color-accent: #2E7D00;
      --scalar-font: "Inter", ui-sans-serif, system-ui, sans-serif;
      --scalar-font-code: "JetBrains Mono", ui-monospace, monospace;
      --scalar-radius: 10px;
    }
    .dark { --scalar-color-accent: #8CFF2E; }
  `,
};

onMounted(() => {
  if (!host.value) return;
  // Standard Scalar CDN embed: a #api-reference script with the spec URL +
  // configuration, then the loader — the most version-stable integration.
  const ref = document.createElement("script");
  ref.id = "api-reference";
  ref.setAttribute("data-url", "/openapi.yaml");
  ref.setAttribute("data-configuration", JSON.stringify(configuration));
  host.value.appendChild(ref);

  const loader = document.createElement("script");
  loader.src = "https://cdn.jsdelivr.net/npm/@scalar/api-reference";
  loader.crossOrigin = "anonymous";
  host.value.appendChild(loader);
});
</script>

<template>
  <div ref="host" class="scalar-root"></div>
</template>

<style>
.scalar-root { width: 100%; min-height: calc(100vh - var(--vp-nav-height, 64px)); }
/* Scalar renders its own full layout; drop VitePress page padding on this route. */
.VPPage:has(.scalar-root) { padding: 0 !important; }
</style>
