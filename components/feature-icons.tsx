"use client"
import { HeartPulse, MessagesSquare, Activity } from "lucide-react"

export function HeartbeatIcon({ className }: { className?: string }) {
  return (
    <div className={className}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
      <HeartPulse className="text-blue-600" style={{ animation: "pulse 1.8s ease-in-out infinite" }} />
    </div>
  )
}

export function ChatPingIcon({ className }: { className?: string }) {
  return (
    <div className={className + " relative inline-flex"}>
      <span className="absolute -right-1 -top-1 inline-flex h-3 w-3 animate-ping rounded-full bg-teal-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-600" />
      <MessagesSquare className="ml-2 text-teal-700" />
    </div>
  )
}

export function TrendIcon({ className }: { className?: string }) {
  return <Activity className={className || "text-blue-600"} />
}

export function PlaceholderCircleIcon({ className }: { className?: string }) {
  return (
    <div
      className={
        className ||
        "inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full border bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] text-slate-600 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60"
      }
      aria-label="Placeholder icon"
    >
      Icon
    </div>
  )
}
