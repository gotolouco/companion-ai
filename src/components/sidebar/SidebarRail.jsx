import { User, Sparkles, Smile, Sun, Moon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function SidebarRail({ avatar, personalidade, armAngle, darkMode, onDarkModeChange, onExpand }) {
  const icons = [
    { icon: User, label: "Avatar", value: avatar },
    { icon: Sparkles, label: "Personalidade", value: personalidade },
    { icon: Smile, label: "Pose dos braços", value: armAngle.toFixed(1) },
  ]

  return (
    <nav className="flex flex-1 flex-col gap-1 p-2">
      {icons.map(({ icon: Icon, label, value }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <button
              onClick={onExpand}
              className="flex h-11 w-full items-center justify-center rounded-xl text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-primary hover:scale-105"
            >
              <Icon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {label}: {value}
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Dark mode quick toggle */}
      <div className="mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onDarkModeChange(!darkMode)}
              className="flex h-11 w-full items-center justify-center rounded-xl text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-primary hover:scale-105"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {darkMode ? 'Modo Claro' : 'Modo Escuro'}
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  )
}