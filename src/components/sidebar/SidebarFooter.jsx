import { ChevronLeft, ChevronRight, X } from "lucide-react"
import pkg from "../../../package.json"

const version = pkg.version

export default function SidebarFooter({ expanded, open, onToggle, onClose }) {
  const aberto = expanded || open

  return (
    <div className="flex flex-col gap-2 border-t border-sidebar-border p-2">
      {open && (
        <button
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent sm:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" /> Fechar
        </button>
      )}

      <button
        onClick={onToggle}
        className="hidden h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent sm:flex"
        aria-label={expanded ? "Recolher painel" : "Expandir painel"}
      >
        {expanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>

      <span
        className={cnVersao(aberto)}
      >
        {aberto ? `Companion AI v${version}` : `v${version}`}
      </span>
    </div>
  )
}


function cnVersao(aberto) {
  return aberto
    ? "px-1 pb-1 text-center text-xs text-muted-foreground"
    : "pb-1 text-center text-[10px] text-muted-foreground"
}
