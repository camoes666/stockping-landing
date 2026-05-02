export const prerender = false;

import { makeHandler } from "@keystatic/astro/api";
import config from "../../../../keystatic.config";
import { env } from "cloudflare:workers";

// Override the default Keystatic API route to inject Cloudflare Worker secrets
// directly. Astro v6 removed `locals.runtime.env`, so we bypass it entirely
// by passing the secrets from `cloudflare:workers` at module-init time.
export const ALL = makeHandler({
  config,
  clientId: env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: env.KEYSTATIC_SECRET,
});
