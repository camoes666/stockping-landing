export const prerender = false;

import { env } from "cloudflare:workers";

export function GET() {
  return new Response(
    JSON.stringify({
      hasClientId: Boolean((env as any).KEYSTATIC_GITHUB_CLIENT_ID),
      hasClientSecret: Boolean((env as any).KEYSTATIC_GITHUB_CLIENT_SECRET),
      hasSecret: Boolean((env as any).KEYSTATIC_SECRET),
      envKeys: Object.keys(env as any),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
