import { User, Sparkles, Smile, Sun, Moon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MODELOS } from "@/lib/models"
import { PERSONALIDADES } from "@/lib/personalidades"
import { Field, FieldLabel } from "./Field"

export default function SidebarContent({
  avatar,
  onAvatarChange,
  personalidade,
  onPersonalidadeChange,
  armAngle,
  onArmAngleChange,
  darkMode,
  onDarkModeChange,
}) {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      {/* Dark mode toggle */}
      <Field>
        <FieldLabel icon={darkMode ? Moon : Sun}>Aparência</FieldLabel>
        <button
          onClick={() => onDarkModeChange(!darkMode)}
          className="relative flex h-9 w-full items-center justify-between rounded-xl border border-border bg-input/30 px-3 text-sm transition-all hover:bg-accent hover:text-accent-foreground"
        >
          <span className="text-foreground">{darkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
          {/* Toggle pill */}
          <div className="relative h-5 w-9 rounded-full transition-colors duration-300"
            style={{ background: darkMode
              ? 'linear-gradient(135deg, oklch(0.55 0.28 295), oklch(0.45 0.22 270))'
              : 'oklch(0.72 0.06 290 / 0.4)'
            }}
          >
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </button>
      </Field>

      <div className="h-px bg-border/50" />

      <Field>
        <FieldLabel icon={User}>Avatar</FieldLabel>
        <Select value={avatar} onValueChange={onAvatarChange}>
          <SelectTrigger className="w-full glass border-border/60">
            <SelectValue placeholder="Escolha um modelo" />
          </SelectTrigger>
          <SelectContent>
            {MODELOS.map((m) => (
              <SelectItem key={m.file} value={m.file}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel icon={Sparkles}>Personalidade</FieldLabel>
        <Select value={personalidade} onValueChange={onPersonalidadeChange}>
          <SelectTrigger className="w-full glass border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERSONALIDADES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel icon={Smile} value={armAngle.toFixed(2)}>
          Pose dos braços
        </FieldLabel>
        <Slider
          min={0}
          max={1.6}
          step={0.05}
          value={[armAngle]}
          onValueChange={(v) => onArmAngleChange(v[0])}
        />
        <span className="text-xs text-muted-foreground">
          Ajuste se os braços ficarem levantados ou cruzados.
        </span>
      </Field>
    </nav>
  )
}