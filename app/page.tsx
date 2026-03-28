import { StyleTransformer } from "@/components/features/StyleTransformer";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1.5rem",
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1
          style={{
            margin: "0 0 0.5rem",
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          文体変換
        </h1>
        <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.95rem" }}>
          同じ内容を、相手に合わせた言葉に。
        </p>
      </header>

      <StyleTransformer />
    </main>
  );
}
