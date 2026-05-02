import { defineMiddleware } from "astro:middleware";
// Static import so Cloudflare Workers runtime resolves the binding at deploy time.
// `cloudflareModules: true` in astro.config.mjs externalizes this from Vite.
import { env as cfEnv } from "cloudflare:workers";

/**
 * Compatibility shim for @keystatic/astro v5 on Astro v6.
 *
 * Astro v6 removed `Astro.locals.runtime.env` and replaced it with
 * `import { env } from "cloudflare:workers"`.
 * Keystatic v5.0.6 still reads `context.locals.runtime.env`, so we
 * restore it here before any route handler runs.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = (context.locals as any).runtime;
  if (runtime) {
    try {
      Object.defineProperty(runtime, "env", {
        value: cfEnv,
        writable: true,
        configurable: true,
      });
    } catch {
      // silently ignore — non-Cloudflare environments
    }
  }
  return next();
});
