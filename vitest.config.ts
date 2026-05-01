import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
  resolve: {
    alias: {
      // Stub astro:content for Vitest — only the Zod schema is tested
      "astro:content": new URL("./src/__mocks__/astro-content.ts", import.meta.url).pathname,
    },
  },
});
