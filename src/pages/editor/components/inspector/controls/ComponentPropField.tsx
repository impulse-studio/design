import { useEffect, useId, useRef, useState } from "react"
import type { Json, ManifestProp } from "@digit-ai-studio/shared"
import { propOptions } from "@digit-ai-studio/shared"
import { useEditor } from "@/features/editor/context"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { InspectorSelectField } from "@/pages/editor/components/inspector/InspectorSelectField"
import { NumberField } from "@/components/shared/fields/NumberField"

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
    options = propOptions(prop),
    [json, setJson] = useState(
      mixed ? "" : JSON.stringify(value ?? null, null, 2)
    ),
    [invalid, setInvalid] = useState(false)
  const focused = useRef(false),
    dirty = useRef(false),
    canceled = useRef(false)
  useEffect(() => {
    if (focused.current) return
    setJson(mixed ? "" : JSON.stringify(value ?? null, null, 2))
    setInvalid(false)
  }, [value, mixed])
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
    <Field className="gap-1.5" data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={id}>{prop.name} · JSON</FieldLabel>
      <Textarea
        id={id}
        aria-invalid={invalid}
        className="font-mono text-xs"
        rows={3}
        value={json}
        placeholder={mixed ? "Valeurs mixtes" : undefined}
        onFocus={() => {
          focused.current = true
          dirty.current = false
          canceled.current = false
          editor.begin()
        }}
        onChange={(event) => {
          dirty.current = true
          setJson(event.target.value)
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            canceled.current = true
            editor.cancel()
            setJson(mixed ? "" : JSON.stringify(value ?? null, null, 2))
            setInvalid(false)
            event.currentTarget.blur()
          }
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter")
            event.currentTarget.blur()
        }}
        onBlur={() => {
          focused.current = false
          if (canceled.current) {
            canceled.current = false
            return
          }
          if (!dirty.current) {
            editor.commit()
            return
          }
          try {
            const next: Json = JSON.parse(json)
            onChange(next)
            setInvalid(false)
            editor.commit()
          } catch {
            setInvalid(true)
            editor.cancel()
          }
        }}
      />
      {invalid && (
        <p className="text-xs">
          JSON invalide. La dernière valeur valide est conservée.
        </p>
      )}
    </Field>
  )
}
