import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Playground from "./Playground.vue";
import ScalarApi from "./ScalarApi.vue";
import Landing from "./Landing.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Playground", Playground);
    app.component("ScalarApi", ScalarApi);
    app.component("Landing", Landing);
  },
} satisfies Theme;
