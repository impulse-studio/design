import { useId } from "react"
import { useForm } from "@tanstack/react-form"
import { mockupNameFormSchema } from "@/features/mockups/schemas"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function MockupNameForm({
  name,
  readOnly,
  onRename,
}: {
  name: string
  readOnly: boolean
  onRename: (name: string) => void
}) {
  const id = useId()
  const form = useForm({
    defaultValues: { name },
    validators: { onChange: mockupNameFormSchema },
    onSubmit: ({ value, formApi }) => {
      if (readOnly) return
      const data = mockupNameFormSchema.parse(value)
      onRename(data.name)
      formApi.reset(data)
    },
  })
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (!form.state.isSubmitting) void form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(field) => {
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={invalid}>
              <Input
                className="editor-project-name h-[28px] border-transparent bg-transparent px-1 text-[14px] font-semibold tracking-[-0.02em] shadow-none [&:focus-visible]:border-ring [&:focus-visible]:shadow-[0_0_0_2px_color-mix(in_srgb,_var(--ring),_transparent_80%)] h-7 w-full border-transparent bg-transparent px-1 text-sm font-medium shadow-none focus-visible:border-transparent focus-visible:ring-0"
                name={field.name}
                aria-label="Nom de la maquette"
                aria-invalid={invalid}
                aria-describedby={invalid ? id : undefined}
                readOnly={readOnly}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={() => {
                  field.handleBlur()
                  if (field.state.meta.isDirty && !form.state.isSubmitting)
                    void form.handleSubmit()
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault()
                    event.currentTarget.blur()
                  }
                  if (event.key === "Escape") {
                    form.reset()
                    event.currentTarget.blur()
                  }
                }}
              />
              {invalid && (
                <FieldError id={id} errors={field.state.meta.errors} />
              )}
            </Field>
          )
        }}
      </form.Field>
    </form>
  )
}
