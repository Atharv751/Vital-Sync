"use client"

import AuthGuard from "@/components/auth-guard"

export default function CaregiverDashboard() {
  return (
    <AuthGuard role="caregiver">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-semibold">Caregiver Dashboard</h2>
        <p className="mt-2 text-muted-foreground">View shared recovery summaries from your family member.</p>
        <p className="mt-2 text-sm">This is a placeholder for Caregiver Mode.</p>
      </div>
    </AuthGuard>
  )
}
