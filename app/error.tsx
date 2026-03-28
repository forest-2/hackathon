"use client"

import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error boundary — catches unhandled errors in the React tree.
 * Must be a Client Component.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Error boundary]", error)
  }, [error])

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        gap: "1rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0 }}>Something went wrong</h1>
      <p style={{ margin: 0, color: "var(--color-muted)" }}>
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: "0.5rem 1.25rem",
          border: "1px solid currentColor",
          borderRadius: "0.375rem",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontSize: "0.875rem",
        }}
      >
        Try again
      </button>
    </main>
  )
}
