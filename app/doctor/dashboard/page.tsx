"use client"

import AuthGuard from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { mockPatients } from "@/components/mock-patients"
import { getSession, approveDoctor } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ChatPingIcon } from "@/components/feature-icons"

export default function DoctorDashboard() {
  return (
    <AuthGuard role="doctor">
      <Page />
    </AuthGuard>
  )
}

function Page() {
  const [verified, setVerified] = useState<boolean>(false)
  const [aiRisk, setAiRisk] = useState<{ percent: number; label: "low" | "medium" | "high" } | null>(null)
  const session = getSession()

  useEffect(() => {
    setVerified(!!session?.verified)
  }, [session])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai_wound_risk")
      if (raw) {
        const parsed = JSON.parse(raw) as { percent: number; label: "low" | "medium" | "high" }
        setAiRisk({ percent: parsed.percent, label: parsed.label })
      }
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>
        <div className="flex items-center gap-2">
          {verified ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified Doctor ✅</Badge>
          ) : (
            <>
              <Badge variant="secondary">Pending Verification</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (session?.email) {
                    approveDoctor(session.email)
                    setVerified(true)
                  }
                }}
              >
                Mock Approve Verification
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-lg border bg-teal-50/50 p-4 dark:bg-muted/60">
        <div className="flex items-center gap-3">
          <ChatPingIcon className="h-5 w-5" />
          <div>
            <p className="font-medium">Stay connected</p>
            <p className="text-sm text-muted-foreground">
              Review patient signals and message when trends need attention.
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
            <div
              className="h-24 w-40 bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-background
                         flex items-center justify-center text-xs text-slate-600 dark:text-slate-300"
              aria-label="Dashboard banner placeholder"
            >
              Banner Placeholder
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {aiRisk ? (
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm text-muted-foreground">Latest wound analysis</p>
                <p className="font-medium">
                  Infection risk: {aiRisk.percent}%{" "}
                  <span
                    className={
                      aiRisk.label === "high"
                        ? "text-red-600"
                        : aiRisk.label === "medium"
                          ? "text-yellow-600"
                          : "text-emerald-600"
                    }
                  >
                    ({aiRisk.label === "high" ? "High" : aiRisk.label === "medium" ? "Monitor" : "Low"})
                  </span>
                </p>
              </div>
              <div>
                {aiRisk.label === "high" ? (
                  <Badge className="bg-red-500 hover:bg-red-600">High Priority</Badge>
                ) : aiRisk.label === "medium" ? (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Monitor</Badge>
                ) : (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Stable</Badge>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No AI alerts at this time.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPatients.map((p) => (
            <Link
              key={p.id}
              href={`/doctor/patient/${p.id}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.email}</p>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: "stable" | "monitor" | "urgent" }) {
  if (status === "stable") return <Badge className="bg-emerald-500 hover:bg-emerald-600">Stable</Badge>
  if (status === "monitor") return <Badge className="bg-yellow-500 hover:bg-yellow-600">Monitor</Badge>
  return <Badge className="bg-red-500 hover:bg-red-600">Urgent</Badge>
}
