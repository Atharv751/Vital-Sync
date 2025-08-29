"use client"

import AuthGuard from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getMyData, saveMyData, type Medication, type PatientData } from "@/components/patient-data"
import { motion } from "framer-motion"
import { HeartbeatIcon } from "@/components/feature-icons"
import WoundAIAnalyzer from "@/components/wound-ai"
import Image from "next/image";

export default function PatientDashboard() {
  return (
    <AuthGuard role="patient">
      <Page />
    </AuthGuard>
  )
}

function Page() {
  const [data, setData] = useState<PatientData | null>(null)
  const [pain, setPain] = useState(3)
  const [steps, setSteps] = useState(1000)
  const [exercises, setExercises] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setData(getMyData())
  }, [])

  function savePain() {
    if (!data) return
    const entry = { date: new Date().toISOString().slice(0, 10), value: pain }
    const next = { ...data, pain: [...data.pain.filter((e) => e.date !== entry.date), entry] }
    setData(next)
    saveMyData({ pain: next.pain })
  }

  function toggleMed(idx: number) {
    if (!data) return
    const meds = data.meds.map((m, i) => (i === idx ? { ...m, taken: !m.taken } : m))
    const next = { ...data, meds }
    setData(next)
    saveMyData({ meds })
  }

  function addImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setImagePreview(url)
      if (!data) return
      const nextImgs = [url, ...data.woundImages].slice(0, 8)
      const next = { ...data, woundImages: nextImgs }
      setData(next)
      saveMyData({ woundImages: nextImgs })
    }
    reader.readAsDataURL(file)
  }

  function saveMobility() {
    if (!data) return
    const entry = { date: new Date().toISOString().slice(0, 10), steps, exercises }
    const next = {
      ...data,
      mobility: [...data.mobility.filter((e) => e.date !== entry.date), entry],
    }
    setData(next)
    saveMyData({ mobility: next.mobility })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Patient Dashboard</h2>
        <Button asChild variant="outline">
          <Link href="/patient/reports">View Reports</Link>
        </Button>
      </div>

      {/* Subtle banner with illustration to the top of dashboard */}
      <div className="mb-6 flex items-center justify-between rounded-lg border bg-blue-50/50 p-4 dark:bg-muted">
        <div className="flex items-center gap-3">
          <HeartbeatIcon className="h-5 w-5" />
          <div>
            <p className="font-medium">Stay on track</p>
            <p className="text-sm text-muted-foreground">
              Log pain, meds, and mobility to keep your care team informed.
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-black/5">
            <div className="relative h-24 w-40">
              <Image
                src="https://classroomclipart.com/image/static7/preview2/pediatric-doctor-examining-a-child-patient-in-a-medical-office-69917.jpg"
                alt="Dashboard banner"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Daily Pain Log</CardTitle>
              <CardDescription>Rate your pain today (1–10)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider value={[pain]} min={1} max={10} step={1} onValueChange={(v) => setPain(v[0] ?? 1)} />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today&apos;s Level</span>
                <span className="font-medium">{pain}</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={savePain}>
                Save
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle>Medication Checklist</CardTitle>
              <CardDescription>Track your daily meds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {data?.meds.map((m: Medication, idx: number) => (
                <label key={idx} className="flex cursor-pointer items-center justify-between rounded-md border p-2">
                  <span>{m.name}</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-500"
                    checked={m.taken}
                    onChange={() => toggleMed(idx)}
                  />
                </label>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Wound Image Upload</CardTitle>
              <CardDescription>Upload an image for your doctor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="wound">Select image</Label>
                <Input
                  id="wound"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) addImage(f)
                  }}
                />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg?height=160&width=320&query=wound%20preview"}
                  alt="Wound preview"
                  className="h-40 w-full rounded-md object-cover"
                />
              )}
              <WoundAIAnalyzer imageDataUrl={imagePreview} />
              {data?.woundImages?.length ? (
                <>
                  <p className="text-sm text-muted-foreground">Recent uploads</p>
                  <div className="grid grid-cols-4 gap-2">
                    {data.woundImages.map((u, i) => (
                      <img
                        key={i}
                        src={u || "/placeholder.svg?height=80&width=80&query=wound%20image"}
                        alt={`Wound ${i + 1}`}
                        className="h-20 w-full rounded object-cover"
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle>Mobility Tracker</CardTitle>
              <CardDescription>Steps and exercises today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2">
                <Label>Steps</Label>
                <Input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value || 0))} />
              </div>
              <div className="grid gap-2">
                <Label>Exercises Completed</Label>
                <Input type="number" value={exercises} onChange={(e) => setExercises(Number(e.target.value || 0))} />
              </div>
              <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={saveMobility}>
                Save
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
