"use client"

import type { DemoItem } from "@/types"

interface DatabaseStatusProps {
  items: DemoItem[] | null
  error: string | null
}

/**
 * Renders the Supabase connection status and demo items on the home page.
 * Shows three states: success (items list), error, or empty.
 */
export function DatabaseStatus({ items, error }: DatabaseStatusProps) {
  if (error) {
    return (
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid var(--color-error)",
          borderRadius: "0.5rem",
          color: "var(--color-error)",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem" }}>⚠ Connection error</h2>
        <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>{error}</p>
        <p style={{ margin: "0.75rem 0 0", fontSize: "0.875rem", color: "var(--color-muted)" }}>
          Check that your Supabase credentials in <code>.env.local</code> are correct and that your
          Supabase project is not paused.
        </p>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div
        style={{
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          color: "var(--color-muted)",
        }}
      >
        <h2 style={{ margin: "0 0 0.5rem" }}>No demo items found</h2>
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          Run <code>supabase/seed.sql</code> in your Supabase dashboard to add demo rows.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid var(--color-success)",
        borderRadius: "0.5rem",
      }}
    >
      <h2 style={{ margin: "0 0 1rem", color: "var(--color-success)" }}>
        ✓ Connected to Supabase
      </h2>
      <ul style={{ margin: 0, padding: "0 0 0 1.25rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.25rem" }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
