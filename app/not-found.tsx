import Link from "next/link"

/**
 * 404 — page not found handler.
 */
export default function NotFound() {
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
      <h1 style={{ margin: 0, fontSize: "4rem", fontWeight: 700 }}>404</h1>
      <h2 style={{ margin: 0 }}>Page not found</h2>
      <p style={{ margin: 0, color: "var(--color-muted)" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.5rem 1.25rem",
          border: "1px solid currentColor",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
        }}
      >
        Back to home
      </Link>
    </main>
  )
}
