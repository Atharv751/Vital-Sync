export type PatientSummary = {
  id: string
  name: string
  email: string
  status: "stable" | "monitor" | "urgent"
}

export const mockPatients: PatientSummary[] = [
  { id: "p1", name: "Alex Johnson", email: "alex@example.com", status: "stable" },
  { id: "p2", name: "Maria Chen", email: "maria@example.com", status: "monitor" },
  { id: "p3", name: "Samir Patel", email: "samir@example.com", status: "urgent" },
]
