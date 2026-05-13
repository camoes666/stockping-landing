import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import keystatic from "@keystatic/astro";

export default defineConfig({
  site: "https://stockping-landing.camoes666.workers.dev",
  integrations: [react(), tailwind(), mdx(), sitemap(), keystatic()],
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
    cloudflareModules: true,
  }),
  legacy: {
    collectionsBackwardsCompat: true,
  },
});
