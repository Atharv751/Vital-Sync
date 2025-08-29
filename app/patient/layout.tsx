import type React from "react"
export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50/30 dark:from-background dark:to-background">
      {children}
    </div>
  )
}
