import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "文体変換 — Japanese Style Transformer",
  description:
    "日本語の文体を瞬時に変換。上司向け・恋人向け・やさしい日本語など13種類のスタイルに対応。",
  icons: {
    icon: [
      { url: "/forest-2_2.png", sizes: "32x32", type: "image/png" },
      { url: "/forest-2_2.png", sizes: "96x96", type: "image/png" },
      { url: "/forest-2_2.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/forest-2_2.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>{children}</body>
    </html>
  );
}
