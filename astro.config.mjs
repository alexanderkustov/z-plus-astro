import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const isGitHubPages = Boolean(process.env.GITHUB_PAGES);

export default defineConfig({
  output: "static",
  base: "",
  site: "https://z-plus.co.uk",
  integrations: [react(), sitemap({})]
});
