import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, section } = await request.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "invalid_email" }), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), { status: 400 });
    }

    if (!supabase) {
      return new Response(JSON.stringify({ error: "db_unavailable" }), { status: 500 });
    }

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim(), section: section ?? "unknown" });

    if (error) {
      // unique constraint violation = already registered
      if (error.code === "23505") {
        return new Response(JSON.stringify({ error: "duplicate" }), { status: 409 });
      }
      return new Response(JSON.stringify({ error: "db_error" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "server_error" }), { status: 500 });
  }
};
