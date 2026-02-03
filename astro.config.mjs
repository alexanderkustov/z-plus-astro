import { defineConfig } from "astro/config";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages = Boolean(process.env.GITHUB_PAGES);

export default defineConfig({
  output: "static",
  base: isGitHubPages && repoName ? `/${repoName}` : "",
  site: process.env.SITE ?? "https://example.com"
});
