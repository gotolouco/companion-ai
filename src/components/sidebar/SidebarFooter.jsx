import { Save, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


export default function SidebarFooter({ expanded, onSave, onToggle }) {
  return (
    <div className="flex flex-col gap-2 border-t border-sidebar-border p-2">
      {expanded ? (
        <Button onClick={onSave} className="w-full justify-center gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" onClick={onSave} className="h-11 w-full">
              <Save className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Salvar configurações</TooltipContent>
        </Tooltip>
      )}

      <button
        onClick={onToggle}
        className="flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent"
        aria-label={expanded ? "Recolher painel" : "Expandir painel"}
      >
        {expanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
    </div>
  )
}
