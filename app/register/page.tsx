"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <PatientForm onSuccess={() => router.push("/login")} />
            </TabsContent>
            <TabsContent value="doctor">
              <DoctorForm onSuccess={() => router.push("/login")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PatientForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      addUser({ name, email, password, role: "patient" })
      onSuccess()
    } catch (err: any) {
      setError(err?.message ?? "Registration failed")
    }
  }
  return (
    <form className="mt-4 space-y-4" onSubmit={submit}>
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
        Create Patient Account
      </Button>
    </form>
  )
}

function DoctorForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [documentName, setDocumentName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!documentName) {
      setError("Please upload your license/ID document (PDF/JPEG/PNG)")
      return
    }
    try {
      addUser({ name, email, password, role: "doctor", verified: false, documentName })
      onSuccess()
    } catch (err: any) {
      setError(err?.message ?? "Registration failed")
    }
  }
  return (
    <form className="mt-4 space-y-4" onSubmit={submit}>
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <div className="grid gap-2">
        <Label>License/ID Document (PDF/JPEG/PNG)</Label>
        <Input
          type="file"
          accept=".pdf,image/png,image/jpeg"
          onChange={(e) => {
            const f = e.target.files?.[0]
            setDocumentName(f ? f.name : null)
          }}
          required
        />
        {documentName && <p className="text-xs text-muted-foreground">Uploaded: {documentName}</p>}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
        Create Doctor Account
      </Button>
      <p className="text-xs text-muted-foreground">Note: Verification will be pending until approved (mock).</p>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
