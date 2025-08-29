"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, type Role } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function AuthGuard({
  role,
  children,
}: {
  role: Role
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const s = getSession()
    if (!s) {
      router.replace("/login?redirected=1")
      return
    }
    if (s.role !== role) {
      const target =
        s.role === "doctor" ? "/doctor/dashboard" : s.role === "patient" ? "/patient/dashboard" : "/caregiver/dashboard"
      router.replace(target)
      return
    }
    setReady(true)
  }, [router, role])

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-muted-foreground">Checking session…</span>
      </div>
    )
  }

  return <>{children}</>
}
