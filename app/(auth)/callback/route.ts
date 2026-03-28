import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Handles OAuth provider callbacks and magic link confirmations.
 * Supabase redirects here after the user authenticates externally.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  // Return to an error page if the code exchange fails or no code is present
  return NextResponse.redirect(`${origin}/auth/error`);
}
