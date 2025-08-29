"use client"

import AuthGuard from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMyData } from "@/components/patient-data"
import { useEffect, useMemo, useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"

export default function PatientReports() {
  return (
    <AuthGuard role="patient">
      <Reports />
    </AuthGuard>
  )
}

function Reports() {
  const [pain, setPain] = useState<{ date: string; value: number }[]>([])
  const [mobility, setMobility] = useState<{ date: string; steps: number }[]>([])

  useEffect(() => {
    const d = getMyData()
    setPain(d.pain.sort((a, b) => a.date.localeCompare(b.date)))
    setMobility(d.mobility.sort((a, b) => a.date.localeCompare(b.date)).map((m) => ({ date: m.date, steps: m.steps })))
  }, [])

  const showAlert = useMemo(() => {
    if (pain.length < 3) return false
    const last3 = pain.slice(-3)
    const avg = last3.reduce((s, p) => s + p.value, 0) / last3.length
    return avg >= 7
  }, [pain])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-semibold">Reports</h2>

      {showAlert && (
        <Alert variant="destructive" className="mb-6">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>AI Alert</AlertTitle>
          <AlertDescription>AI suspects delayed healing — contact your doctor.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pain Trend</CardTitle>
            <CardDescription>Recent daily pain levels</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pain}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobility Progress</CardTitle>
            <CardDescription>Steps per day</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mobility}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
