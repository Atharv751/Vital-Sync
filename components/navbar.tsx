"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getSession, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme-toggle"
import { Stethoscope } from "lucide-react"

export default function Navbar() {
  const [name, setName] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const s = getSession()
    setName(s?.name ?? null)
  }, [pathname])

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Stethoscope aria-hidden className="h-8 w-8 text-blue-600" />
          <Link href="/" className="font-semibold text-2xl">
            Vital Sync
          </Link>
        </div>

        <nav className="flex items-center gap-7">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href="/patient/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Patient
          </Link>
          <Link href="/doctor/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Doctor
          </Link>
          <ModeToggle />
          {name ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">Hi, {name}</span>
              <Button
                variant="outline"
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
