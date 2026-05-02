import { defineMiddleware } from "astro:middleware";

/**
 * Compatibility shim for @keystatic/astro v5 on Astro v6.
 *
 * @keystatic/astro reads `Astro.locals.runtime.env` which was removed in
 * Astro v6. The replacement is `import { env } from "cloudflare:workers"`.
 *
 * This middleware re-attaches the actual env to `locals.runtime` before
 * Keystatic tries to access it.
 * `cloudflare:workers` is externalized by Vite when
 * `cloudflareModules: true` is set in astro.config.mjs.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const runtime = (context.locals as any).runtime;
  if (runtime) {
    const desc = Object.getOwnPropertyDescriptor(runtime, "env");
    // The Astro v6 adapter defines a getter that throws — replace it
    if (!desc || typeof desc.get === "function") {
      try {
        // vite-ignore: cloudflare:workers is resolved at Workers runtime,
        // not by Vite's bundler
        const cf = await import(/* @vite-ignore */ "cloudflare:workers");
        Object.defineProperty(runtime, "env", {
          value: cf.env,
          writable: true,
          configurable: true,
        });
      } catch {
        // Local dev without Workers runtime — Keystatic won't work here
        // but all other routes are unaffected
      }
    }
  }
  return next();
});
