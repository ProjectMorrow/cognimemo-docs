import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Cognimemo",
  description: "Persistent memory for AI agents",
  themeConfig: {
    logo: "/brand/cognimemo-icon.png",
    nav: [
      { text: "Docs", link: "/getting-started/overview" },
      { text: "API Reference", link: "/api-reference/overview" },
    ],
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
        text: "SDKs & Integrations",
        items: [
          { text: "Overview", link: "/sdks/overview" },
          { text: "MCP Server", link: "/mcp/overview" },
        ],
      },
      {
        text: "Billing",
        items: [
          { text: "Plans & Pricing", link: "/billing/plans" },
          { text: "Pay-as-you-go", link: "/billing/pay-as-you-go" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "Overview", link: "/api-reference/overview" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/ProjectMorrow" },
    ],
  },
});
