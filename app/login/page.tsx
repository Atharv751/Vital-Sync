"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { login, type Role } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("patient")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const sp = useSearchParams()
  const redirected = sp.get("redirected")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const s = login(email, password, role)
      if (s.role === "doctor") router.replace("/doctor/dashboard")
      else if (s.role === "patient") router.replace("/patient/dashboard")
      else router.replace("/caregiver/dashboard")
    } catch (err: any) {
      setError(err?.message ?? "Login failed")
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          {redirected && <p className="text-sm text-amber-600 dark:text-amber-400">Please login to continue.</p>}
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="caregiver">Caregiver (optional)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">
              Login
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link className="underline hover:text-foreground" href="/register">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
