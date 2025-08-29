"use client"

import AuthGuard from "@/components/auth-guard"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPatients } from "@/components/mock-patients"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"
import { useEffect, useState } from "react"
import { getMyData } from "@/components/patient-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ChatMsg = { from: "doctor" | "patient"; text: string; ts: number }

function chatKey(id: string) {
  return `psrt_chat_${id}`
}

function loadChat(id: string): ChatMsg[] {
  try {
    const raw = localStorage.getItem(chatKey(id))
    return raw ? (JSON.parse(raw) as ChatMsg[]) : []
  } catch {
    return []
  }
}
function saveChat(id: string, msgs: ChatMsg[]) {
  localStorage.setItem(chatKey(id), JSON.stringify(msgs))
}

export default function DoctorPatientDetail() {
  return (
    <AuthGuard role="doctor">
      <Page />
    </AuthGuard>
  )
}

function Page() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const patient = mockPatients.find((p) => p.id === id)
  const [pain, setPain] = useState<{ date: string; value: number }[]>([])
  const [adherence, setAdherence] = useState<{ name: string; taken: number }[]>([])
  const [images, setImages] = useState<string[]>([])
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [text, setText] = useState("")

  useEffect(() => {
    // For demo, reuse current patient's dataset; a real app would fetch per patient id
    const d = getMyData()
    setPain(d.pain.sort((a, b) => a.date.localeCompare(b.date)))
    const medsTaken = d.meds.map((m) => ({ name: m.name, taken: m.taken ? 1 : 0 }))
    setAdherence(medsTaken)
    setImages(d.woundImages ?? [])
    setChat(loadChat(id))
  }, [id])

  function send() {
    if (!text.trim()) return
    const msg: ChatMsg = { from: "doctor", text: text.trim(), ts: Date.now() }
    const next = [...chat, msg]
    setChat(next)
    saveChat(id, next)
    setText("")
  }

  if (!patient) {
    return <div className="p-6">Patient not found.</div>
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-semibold">{patient.name}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pain Log</CardTitle>
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
            <CardTitle>Medication Adherence</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherence}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Bar dataKey="taken" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Uploaded Wound Images</CardTitle>
          </CardHeader>
          <CardContent>
            {images.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {images.map((u, i) => (
                  <img
                    key={i}
                    src={u || "/placeholder.svg?height=128&width=128&query=wound%20image"}
                    alt={`Wound ${i + 1}`}
                    className="h-32 w-full rounded object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Doctor–Patient Chat (Mock)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded border p-3">
              {chat.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                chat.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "doctor" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded px-3 py-2 text-sm ${m.from === "doctor" ? "bg-blue-600 text-white" : "bg-muted"}`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={send}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
