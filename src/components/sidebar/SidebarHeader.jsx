import { Bot } from "lucide-react"


export default function SidebarHeader({ expanded }) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Bot className="h-5 w-5" />
      </div>
      {expanded && (
        <span className="truncate text-lg font-semibold text-sidebar-foreground">
          Companion AI
        </span>
      )}
    </div>
  )
}
