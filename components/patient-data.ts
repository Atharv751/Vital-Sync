"use client"

import { getSession } from "@/lib/auth"

const DATA_KEY = "psrt_patient_data"

export type PainEntry = { date: string; value: number }
export type MobilityEntry = { date: string; steps: number; exercises: number }
export type Medication = { name: string; taken: boolean }
export type PatientData = {
  email: string
  pain: PainEntry[]
  mobility: MobilityEntry[]
  meds: Medication[]
  woundImages: string[] // data URLs
}

function isBrowser() {
  return typeof window !== "undefined"
}

function loadAll(): PatientData[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(DATA_KEY)
    return raw ? (JSON.parse(raw) as PatientData[]) : []
  } catch {
    return []
  }
}

function saveAll(all: PatientData[]) {
  if (!isBrowser()) return
  localStorage.setItem(DATA_KEY, JSON.stringify(all))
}

export function getMyData(): PatientData {
  const s = getSession()
  const email = s?.email ?? "anon@local"
  const all = loadAll()
  let d = all.find((x) => x.email === email)
  if (!d) {
    d = {
      email,
      pain: [],
      mobility: [],
      meds: [
        { name: "Antibiotic", taken: false },
        { name: "Painkiller", taken: false },
        { name: "Anti-inflammatory", taken: false },
      ],
      woundImages: [],
    }
    all.push(d)
    saveAll(all)
  }
  return d
}

export function saveMyData(update: Partial<PatientData>) {
  const s = getSession()
  if (!s) return
  const all = loadAll()
  const idx = all.findIndex((x) => x.email === s.email)
  if (idx === -1) return
  all[idx] = { ...all[idx], ...update }
  saveAll(all)
}
