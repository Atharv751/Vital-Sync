"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MoonStar, Sun } from "lucide-react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <Button aria-label="Toggle theme" variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </Button>
  )
}
