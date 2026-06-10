import { Bot } from "lucide-react"


export default function SidebarHeader({ expanded }) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
      {/* Gradient icon badge */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl relative overflow-hidden shadow-lg shadow-primary/30"
        style={{ background: 'linear-gradient(135deg, oklch(0.55 0.28 295), oklch(0.45 0.22 270))' }}
      >
        {/* Inner glass shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-xl pointer-events-none" />
        <Bot className="h-4 w-4 text-white relative z-10" />
      </div>
      {expanded && (
        <span className="truncate text-base font-semibold text-sidebar-foreground tracking-tight">
          Companion AI
        </span>
      )}
    </div>
  )
}
