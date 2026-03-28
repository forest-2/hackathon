import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Hackathon Starter",
  description:
    "A Next.js + Supabase template for rapid hackathon prototyping. Replace this with your project description.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
