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
  { value: "dev", label: "Dev", icon: <RiCodeSSlashLine /> },
  { value: "edit", label: "Édition", icon: <RiPencilRuler2Line /> },
] as const

export function SiteModeIsland({
  mode,
  onMode,
}: {
  mode: SiteMode
  onMode: (mode: SiteMode) => void
}) {
  return (
    <EditorIsland
      label="Modes du site"
      mode={mode === "dev" ? "inspect" : "design"}
    >
      <ModeSwitch
        value={mode}
        ariaLabel="Mode du site"
        options={modes}
        onValueChange={onMode}
      />
    </EditorIsland>
  )
}
