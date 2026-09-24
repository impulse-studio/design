import { COLOR_TOKENS, FONT_SIZE_TOKENS, FONT_WEIGHTS, type TextNode } from "@digit-ai-studio/shared"

import { FieldRow, PanelSection, SelectField, TextField } from "@/components/studio"

import { useEditorActions } from "../../context"

const sizeOptions = FONT_SIZE_TOKENS.map((t) => ({ value: t, label: t.replace("font-size-", "") }))
const weightOptions = FONT_WEIGHTS.map((w) => ({ value: String(w), label: String(w) }))
const colorOptions = COLOR_TOKENS.map((t) => ({ value: t, label: t }))

export function TextSection({ node }: { node: TextNode }) {
  const { updateNode } = useEditorActions()
  const update = (recipe: (n: TextNode) => void) => updateNode(node.id, (n) => n.type === "text" && recipe(n))

  return (
    <PanelSection title="Texte">
      <TextField value={node.content} onCommit={(content) => update((n) => void (n.content = content))} />
      <FieldRow>
        <SelectField
          prefix="Aa"
          value={node.textStyle?.token ?? "font-size-md"}
          options={sizeOptions}
          onChange={(token) => update((n) => void (n.textStyle = { token }))}
        />
        <SelectField
          value={String(node.weight ?? 400)}
          options={weightOptions}
          onChange={(w) => update((n) => void (n.weight = Number(w) as TextNode["weight"]))}
        />
      </FieldRow>
      <SelectField
        prefix="●"
        value={node.color?.token ?? "foreground"}
        options={colorOptions}
        onChange={(token) => update((n) => void (n.color = { token }))}
      />
    </PanelSection>
  )
}
