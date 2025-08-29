import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Vital Sync",
  description: "A modern, secure, and patient‑centric platform for tracking post‑surgery recovery with insights for you and your care team.",
  generator: "Atharv Kumar",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          <main className="min-h-[calc(100dvh-64px)]">{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
