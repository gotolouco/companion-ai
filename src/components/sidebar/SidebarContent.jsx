import { User, Sparkles, Smile } from "lucide-react"
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
}) {
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <Field>
        <FieldLabel icon={User}>Avatar</FieldLabel>
        <Select value={avatar} onValueChange={onAvatarChange}>
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERSONALIDADES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
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
