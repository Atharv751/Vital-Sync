"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type RiskLevel = "low" | "medium" | "high"

function computeRiskFromDataUrl(dataUrl: string): number {
  // Deterministic pseudo "AI": hash the data URL to a 0–100 range
  let sum = 0
  for (let i = 0; i < dataUrl.length; i++) {
    sum = (sum + dataUrl.charCodeAt(i) * (i + 1)) % 10007
  }
  return sum % 101 // 0..100
}

function labelForRisk(pct: number): RiskLevel {
  if (pct >= 80) return "high"
  if (pct >= 40) return "medium"
  return "low"
}

function borderClasses(level: RiskLevel) {
  if (level === "high") return "border-red-500"
  if (level === "medium") return "border-yellow-500"
  return "border-emerald-500"
}

export default function WoundAIAnalyzer({ imageDataUrl }: { imageDataUrl: string | null }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [risk, setRisk] = useState<number | null>(null)

  const level: RiskLevel | null = useMemo(() => {
    if (risk == null) return null
    return labelForRisk(risk)
  }, [risk])

  useEffect(() => {
    if (!imageDataUrl) return
    setAnalyzing(true)
    // Simulate async AI call
    const id = setTimeout(() => {
      const pct = computeRiskFromDataUrl(imageDataUrl)
      setRisk(pct)
      setAnalyzing(false)
      try {
        localStorage.setItem(
          "ai_wound_risk",
          JSON.stringify({
            percent: pct,
            probability: pct / 100,
            label: labelForRisk(pct),
            at: new Date().toISOString(),
            source: "mock-ai-v1",
          }),
        )
      } catch {
        // ignore
      }
    }, 700)
    return () => clearTimeout(id)
  }, [imageDataUrl])

  const size = 120
  const stroke = 10
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const dashOffset = risk != null ? circumference * (1 - risk / 100) : circumference

  return (
    <Card className="mt-2">
      <CardContent className="p-4">
        <div className={`rounded-md border-2 p-4 ${level ? borderClasses(level) : "border-muted-foreground/20"}`}>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">AI Infection Risk</p>
            <Button
              size="sm"
              variant="outline"
              disabled={!imageDataUrl || analyzing}
              onClick={() => {
                if (!imageDataUrl) return
                setAnalyzing(true)
                setTimeout(() => {
                  const pct = computeRiskFromDataUrl(imageDataUrl + "|rerun")
                  setRisk(pct)
                  setAnalyzing(false)
                  try {
                    localStorage.setItem(
                      "ai_wound_risk",
                      JSON.stringify({
                        percent: pct,
                        probability: pct / 100,
                        label: labelForRisk(pct),
                        at: new Date().toISOString(),
                        source: "mock-ai-v1",
                      }),
                    )
                  } catch {}
                }, 600)
              }}
            >
              {analyzing ? "Analyzing..." : "Re-analyze"}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            {/* Circular gauge */}
            <svg width={size} height={size} className="shrink-0">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="var(--muted)"
                strokeWidth={stroke}
                fill="none"
                className="opacity-20"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={level === "high" ? "#ef4444" : level === "medium" ? "#eab308" : "#10b981"}
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 700ms ease" }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
              <text
                x="50%"
                y="48%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-foreground"
                fontSize="18"
                fontWeight="600"
              >
                {risk != null ? `${risk}%` : "--"}
              </text>
              <text
                x="50%"
                y="62%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="12"
              >
                {level ? (level === "high" ? "High" : level === "medium" ? "Monitor" : "Low") : "Pending"}
              </text>
            </svg>

            {/* Details */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                This is a mock AI demo to visualize infection risk from wound images.
              </p>
              <ul className="text-sm">
                <li>• Low: green border, routine check-ins</li>
                <li>• Monitor: yellow border, watch for changes</li>
                <li>• High: red border, contact your care team</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
