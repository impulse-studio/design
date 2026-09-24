import { FRAME_PRESETS, type FrameNode, type FramePreset } from "@digit-ai-studio/shared"

import { FieldRow, NumberField, PanelSection, SelectField } from "@/components/studio"

import { useEditorActions } from "../../context"

const presetOptions = Object.entries(FRAME_PRESETS).map(([value, p]) => ({
  value: value as FramePreset,
  label: `${p.label} · ${p.width}×${p.height}`,
}))

export function FrameSection({ frame }: { frame: FrameNode }) {
  const { updateNode } = useEditorActions()
  const update = (recipe: (f: FrameNode) => void) => updateNode(frame.id, (n) => n.type === "frame" && recipe(n))

  return (
    <PanelSection title="Frame">
      <SelectField
        value={frame.preset}
        options={presetOptions}
        onChange={(preset) =>
          update((f) => {
            f.preset = preset
            f.width = FRAME_PRESETS[preset].width
            f.height = FRAME_PRESETS[preset].height
          })
        }
      />
      <FieldRow>
        <NumberField prefix="X" value={frame.x} onCommit={(x) => update((f) => void (f.x = x))} />
        <NumberField prefix="Y" value={frame.y} onCommit={(y) => update((f) => void (f.y = y))} />
        <NumberField
          prefix="W"
          value={frame.width}
          min={1}
          onCommit={(w) =>
            update((f) => {
              f.width = w
              f.preset = undefined
            })
          }
        />
        <NumberField
          prefix="H"
          value={frame.height === "hug" ? undefined : frame.height}
          placeholder="Hug"
          min={1}
          onCommit={(h) =>
            update((f) => {
              f.height = h
              f.preset = undefined
            })
          }
        />
      </FieldRow>
    </PanelSection>
  )
}
