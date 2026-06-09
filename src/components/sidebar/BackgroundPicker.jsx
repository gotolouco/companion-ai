import { Ban } from "lucide-react"
import { BACKGROUNDS } from "@/lib/backgrounds"
import { cn } from "@/lib/utils"


export default function BackgroundPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {BACKGROUNDS.map((b) => {
        const selecionado = (b.file ?? null) === (value ?? null)
        return (
          <button
            key={b.file ?? "none"}
            onClick={() => onChange(b.file)}
            title={b.label}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
              selecionado
                ? "border-primary"
                : "border-transparent hover:border-sidebar-accent"
            )}
          >
            {b.file ? (
              <img
                src={`/assets/${b.file}`}
                alt={b.label}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                <Ban className="h-5 w-5" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
