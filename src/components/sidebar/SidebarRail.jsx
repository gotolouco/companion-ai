import { User, Sparkles, Smile } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export default function SidebarRail({ avatar, personalidade, armAngle, onExpand }) {
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
              className="flex h-11 w-full items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Icon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {label}: {value}
          </TooltipContent>
        </Tooltip>
      ))}
    </nav>
  )
}
