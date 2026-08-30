import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Cognimemo",
  description: "Persistent, queryable memory for AI agents — retain, recall, reflect.",
  cleanUrls: true,
  themeConfig: {
    logo: "/brand/cognimemo-icon.png",
    nav: [
      { text: "Docs", link: "/getting-started/overview" },
      { text: "SDKs", link: "/sdks/overview" },
      { text: "API Reference", link: "/api-reference/overview" },
      { text: "MCP", link: "/mcp/overview" },
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
          { text: "Overview", link: "/api-reference/overview" },
          { text: "Retain", link: "/api-reference/retain" },
          { text: "Recall", link: "/api-reference/recall" },
          { text: "Reflect", link: "/api-reference/reflect" },
          { text: "Spaces & Banks", link: "/api-reference/spaces-banks" },
        ],
      },
      {
        text: "Cloud",
        items: [
          { text: "Gateway API", link: "/cloud/gateway" },
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
