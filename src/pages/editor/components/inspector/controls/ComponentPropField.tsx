import { useId } from "react"
import type { Json, ManifestProp } from "@digit-ai-studio/shared"
import { propOptions } from "@digit-ai-studio/shared"
import { useEditor } from "@/features/editor/context"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { NumberField } from "@/components/shared/fields/NumberField"
import {
  INVALID_DRAFT,
  useDraftEdit,
} from "@/components/shared/fields/use-draft-edit"

export function ComponentPropField({
  prop,
  value,
  onChange,
  mixed = false,
}: {
  prop: ManifestProp
  value: Json | undefined
  onChange: (value: Json) => void
  mixed?: boolean
}) {
  const editor = useEditor(),
    id = useId(),
    options = propOptions(prop)
  const jsonEdit = useDraftEdit<Json | undefined, Json, HTMLTextAreaElement>({
    value,
    format: (current) =>
      mixed ? "" : JSON.stringify(current ?? null, null, 2),
    parse: (draft) => {
      try {
        return JSON.parse(draft) as Json
      } catch {
        return INVALID_DRAFT
      }
    },
    apply: (next) => {
      onChange(next)
      return next
    },
    identity: prop.name,
    selectOnFocus: false,
  })
  const type = prop.type
    .replace(/\s*\|\s*undefined/g, "")
    .replace(/null\s*\|\s*/g, "")
    .trim()
  if (options.length)
    return (
      <InspectorSelectField
        label={prop.name}
        value={value === undefined ? undefined : String(value)}
        placeholder={mixed ? "Mixte" : "Par défaut"}
        options={options.map((option) => ({ value: option, label: option }))}
        onChange={onChange}
      />
    )
  if (type === "boolean" || type === "false | true")
    return (
      <Field orientation="horizontal">
        <FieldLabel htmlFor={id}>
          {prop.name}
          {mixed && <span className="text-muted-foreground"> · Mixte</span>}
        </FieldLabel>
        <Switch id={id} checked={value === true} onCheckedChange={onChange} />
      </Field>
    )
  if (type === "number")
    return (
      <NumberField
        label={prop.name}
        value={typeof value === "number" ? value : undefined}
        onChange={onChange}
        placeholder={mixed ? "Mixte" : "Par défaut"}
      />
    )
  if (type === "string")
    return (
      <Field className="gap-1.5">
        <FieldLabel htmlFor={id}>{prop.name}</FieldLabel>
        <Input
          id={id}
          controlSize="sm"
          value={typeof value === "string" ? value : ""}
          placeholder={
            mixed ? "Mixte" : prop.required ? "Requis" : "Par défaut"
          }
          onFocus={editor.begin}
          onBlur={editor.commit}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              event.currentTarget.blur()
            }
            if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              editor.cancel()
              event.currentTarget.blur()
            }
          }}
        />
      </Field>
    )
  return (
    <Field className="gap-1.5" data-invalid={jsonEdit.invalid || undefined}>
      <FieldLabel htmlFor={id}>{prop.name} · JSON</FieldLabel>
      <Textarea
        id={id}
        aria-invalid={jsonEdit.invalid}
        className="font-mono text-xs"
        rows={3}
        value={jsonEdit.draft}
        placeholder={mixed ? "Valeurs mixtes" : undefined}
        onFocus={jsonEdit.onFocus}
        onChange={(event) => jsonEdit.setDraft(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter")
            event.currentTarget.blur()
          jsonEdit.onKeyDown(event)
        }}
        onBlur={jsonEdit.onBlur}
      />
      {jsonEdit.invalid && (
        <p className="text-xs">
          JSON invalide. La dernière valeur valide est conservée.
        </p>
      )}
    </Field>
  )
}
