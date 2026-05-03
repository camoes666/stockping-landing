export const prerender = false;

import type { APIContext } from "astro";
import { makeHandler } from "@keystatic/astro/api";
import config from "../../../../keystatic.config";

export async function ALL(context: APIContext) {
  return makeHandler({ config })(context);
}
