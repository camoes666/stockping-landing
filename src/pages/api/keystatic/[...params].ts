export const prerender = false;

import type { APIContext } from "astro";
import { makeHandler } from "@keystatic/astro/api";
import config from "../../../../keystatic.config";
import { env } from "cloudflare:workers";

// Call makeHandler per-request so it always reads the current env values.
// (Module-level call would capture secrets at init time and miss updates.)
export async function ALL(context: APIContext) {
  return makeHandler({
    config,
    clientId: env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret: env.KEYSTATIC_SECRET,
  })(context);
}
