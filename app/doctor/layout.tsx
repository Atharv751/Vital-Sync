import type React from "react"
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-teal-50/30 dark:from-background dark:to-background">
      {children}
    </div>
  )
}
