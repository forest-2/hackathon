import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * GET /api/health
 * Returns database connection status.
 * Used by the home page and external health monitoring.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("demo_items").select("id").limit(1)

    if (error) {
      console.error("[health] DB query error:", error.message)
      return NextResponse.json(
        { status: "error", message: "Database connection failed" },
        { status: 503 },
      )
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[health] Unexpected error:", err)
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    )
  }
}
