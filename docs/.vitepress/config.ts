import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Cognimemo",
  description: "Persistent, queryable memory for AI agents — retain, recall, reflect.",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" }],
  ],
  themeConfig: {
    logo: "/brand/cognimemo-icon.png",
    nav: [
      { text: "Docs", link: "/getting-started/overview" },
      { text: "SDKs", link: "/sdks/overview" },
      { text: "API Reference", link: "/api" },
      { text: "MCP", link: "/mcp/overview" },
      { text: "Self-Hosting", link: "/self-hosting/overview" },
      { text: "Playground", link: "/playground" },
    ],
    search: { provider: "local" },
    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Overview", link: "/getting-started/overview" },
          { text: "Quickstart", link: "/getting-started/quickstart" },
          { text: "Authentication", link: "/getting-started/authentication" },
        ],
      },
      {
        text: "Concepts",
        items: [
          { text: "Memory model", link: "/concepts/memory-model" },
          { text: "Typed memory blocks", link: "/concepts/typed-blocks" },
          { text: "Org & layered memory", link: "/concepts/org-memory" },
          { text: "Entities & graph", link: "/concepts/entities" },
          { text: "Encryption at rest", link: "/concepts/encryption" },
        ],
      },
      {
        text: "SDKs",
        items: [
          { text: "Overview", link: "/sdks/overview" },
          { text: "Python", link: "/sdks/python" },
          { text: "TypeScript", link: "/sdks/typescript" },
        ],
      },
      {
        text: "MCP",
        items: [
          { text: "MCP Server", link: "/mcp/overview" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "Interactive reference ↗", link: "/api" },
        ],
      },
      {
        text: "Cloud",
        items: [
          { text: "Gateway API", link: "/cloud/gateway" },
        ],
      },
      {
        text: "Self-Hosting",
        items: [
          { text: "Overview", link: "/self-hosting/overview" },
        ],
      },
      {
        text: "Try it",
        items: [
          { text: "Playground", link: "/playground" },
          { text: "Performance & accuracy", link: "/benchmarks/performance" },
        ],
      },
      {
        text: "Billing",
        items: [
          { text: "Plans & Pricing", link: "/billing/plans" },
          { text: "Pay-as-you-go", link: "/billing/pay-as-you-go" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/ProjectMorrow" },
    ],
  },
});
