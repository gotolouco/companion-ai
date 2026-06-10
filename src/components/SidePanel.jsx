import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import SidebarHeader from "./sidebar/SidebarHeader"
import SidebarContent from "./sidebar/SidebarContent"
import SidebarRail from "./sidebar/SidebarRail"
import SidebarFooter from "./sidebar/SidebarFooter"

export default function SidePanel({
  avatar,
  onAvatarChange,
  personalidade,
  onPersonalidadeChange,
  armAngle,
  onArmAngleChange,
  darkMode,
  onDarkModeChange,
}) {
  const [expanded, setExpanded] = useState(false)

  const salvar = () => {
    localStorage.setItem(
      "companion-config",
      JSON.stringify({ avatar, personalidade, armAngle })
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "sidebar-glass fixed left-0 top-0 z-20 flex h-full flex-col h-full border-sidebar-border transition-all duration-300 ease-in-out",
          expanded ? "w-[85vw, 288px]" : "w-14 md:w-16"
        )}
      >
        <SidebarHeader expanded={expanded} />

        {expanded ? (
          <SidebarContent
            avatar={avatar}
            onAvatarChange={onAvatarChange}
            personalidade={personalidade}
            onPersonalidadeChange={onPersonalidadeChange}
            armAngle={armAngle}
            onArmAngleChange={onArmAngleChange}
            darkMode={darkMode}
            onDarkModeChange={onDarkModeChange}
          />
        ) : (
          <SidebarRail
            avatar={avatar}
            personalidade={personalidade}
            armAngle={armAngle}
            darkMode={darkMode}
            onDarkModeChange={onDarkModeChange}
            onExpand={() => setExpanded(true)}
          />
        )}

        <SidebarFooter
          expanded={expanded}
          onSave={salvar}
          onToggle={() => setExpanded((v) => !v)}
        />
      </aside>
    </TooltipProvider>
  )
}