import { DatabaseStatus } from "@/components/features/DatabaseStatus"
import { createClient } from "@/lib/supabase/server"
import type { DemoItem } from "@/types"
import { Suspense } from "react"

async function fetchDemoItems(): Promise<{ items: DemoItem[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("demo_items").select("*").order("id")

    if (error) return { items: null, error: "Database connection failed" }
    return { items: data as DemoItem[], error: null }
  } catch {
    return { items: null, error: "Failed to connect to database" }
  }
}

async function HomeContent() {
  const { items, error } = await fetchDemoItems()
  return <DatabaseStatus items={items} error={error} />
}

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "2rem",
        maxWidth: "640px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "2rem" }}>🚀 Hackathon Starter</h1>
        <p style={{ margin: 0, color: "var(--color-muted)" }}>
          Next.js 15 + Supabase template — replace this page with your project
        </p>
      </header>

      <section style={{ width: "100%" }}>
        <Suspense
          fallback={
            <div style={{ padding: "1.5rem", color: "var(--color-muted)", textAlign: "center" }}>
              Checking database connection…
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      </section>

      <footer style={{ fontSize: "0.75rem", color: "var(--color-muted)", textAlign: "center" }}>
        See <code>docs/spec-kit/README.md</code> to start building with spec-kit
      </footer>
    </main>
  )
}
