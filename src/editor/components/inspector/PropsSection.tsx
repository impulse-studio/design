import type { ComponentNode, Json, TemplateNode } from "@digit-ai-studio/shared"

import { FieldLabel, PanelSection, Switch, TextField, NumberField } from "@/components/studio"

import { useEditorActions } from "../../context"

function PropField({ name, value, onChange }: { name: string; value: Json; onChange: (v: Json) => void }) {
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <FieldLabel>{name}</FieldLabel>
        <Switch label={name} checked={value} onChange={onChange} />
      </div>
    )
  }
  if (typeof value === "number") {
    return <NumberField prefix={name} value={value} onCommit={onChange} />
  }
  if (typeof value === "string") {
    return (
      <div className="flex flex-col gap-1">
        <FieldLabel>{name}</FieldLabel>
        <TextField value={value} onCommit={onChange} />
      </div>
    )
  }
  // Arrays/objects get a JSON editor once props come from the manifest (M1).
  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{name}</FieldLabel>
      <pre className="max-h-24 overflow-auto rounded-md bg-muted p-2 text-[10px]">{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}

/** Props currently set on the node. The full list with types and defaults comes from the manifest in M1. */
export function PropsSection({ node }: { node: ComponentNode | TemplateNode }) {
  const { updateNode } = useEditorActions()
  const props = Object.entries(node.props ?? {})
  const text = node.type === "component" ? node.text : undefined
  const setProp = (name: string, value: Json) =>
    updateNode(node.id, (n) => {
      if (n.type === "component" || n.type === "template") n.props = { ...n.props, [name]: value }
    })

  return (
    <PanelSection title="Propriétés">
      {text !== undefined && (
        <div className="flex flex-col gap-1">
          <FieldLabel>Texte</FieldLabel>
          <TextField
            value={text}
            onCommit={(text) =>
              updateNode(node.id, (n) => {
                if (n.type === "component") n.text = text
              })
            }
          />
        </div>
      )}
      {props.length === 0 && text === undefined && <FieldLabel>Aucune prop définie</FieldLabel>}
      {props.map(([name, value]) => (
        <PropField key={name} name={name} value={value} onChange={(v) => setProp(name, v)} />
      ))}
    </PanelSection>
  )
}
