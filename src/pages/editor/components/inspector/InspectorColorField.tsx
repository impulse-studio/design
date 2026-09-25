import type { ComponentProps } from "react"
import { ColorField } from "@/components/shared/fields/ColorField"
import { useEditor } from "@/features/editor/context"
import { colorTokens, pageColors } from "@/features/editor/colors"

const EYE_DROPPER_NOTICE =
  "La pipette système est disponible dans Chrome et Edge. Vous pouvez saisir une couleur HEX ici."

type InspectorColorFieldProps = Omit<
  ComponentProps<typeof ColorField>,
  "tokens" | "getSwatches" | "swatchesLabel" | "onEyeDropperUnavailable"
>

export function InspectorColorField(props: InspectorColorFieldProps) {
  const editor = useEditor()
  return (
    <ColorField
      {...props}
      tokens={colorTokens}
      getSwatches={() => pageColors(editor.state.get().doc)}
      swatchesLabel="Sur cette page"
      onEyeDropperUnavailable={() => editor.set({ notice: EYE_DROPPER_NOTICE })}
    />
  )
}
