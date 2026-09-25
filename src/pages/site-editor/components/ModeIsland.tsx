import {
  RiCodeSSlashLine,
  RiCursorLine,
  RiPencilRuler2Line,
} from "@remixicon/react"
import { EditorIsland } from "@/components/shared/EditorIsland"
import { ModeSwitch } from "@/components/shared/ModeSwitch"
import type { SiteMode } from "./Toolbar"

const modes = [
  { value: "navigation", label: "Navigation", icon: <RiCursorLine /> },
  { value: "edit", label: "Édition", icon: <RiPencilRuler2Line /> },
  { value: "dev", label: "Dev", icon: <RiCodeSSlashLine /> },
] as const

export function SiteModeIsland({
  mode,
  onMode,
}: {
  mode: SiteMode
  onMode: (mode: SiteMode) => void
}) {
  return (
    <EditorIsland label="Modes du site" className="bottom-10">
      <ModeSwitch
        value={mode}
        ariaLabel="Mode du site"
        options={modes}
        onValueChange={onMode}
      />
    </EditorIsland>
  )
}
