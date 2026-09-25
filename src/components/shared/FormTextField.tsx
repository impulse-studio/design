import { useId } from "react"
import type { ComponentProps } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormTextFieldProps = {
  field: {
    name: string
    state: {
      value: string
      meta: {
        isTouched: boolean
        isValid: boolean
        errors: Array<{ message?: string } | undefined>
      }
    }
    handleChange: (value: string) => void
    handleBlur: () => void
  }
  label: string
  className?: string
} & Pick<
  ComponentProps<typeof Input>,
  | "type"
  | "placeholder"
  | "disabled"
  | "autoComplete"
  | "maxLength"
  | "required"
>

export function FormTextField({
  field,
  label,
  className,
  ...inputProps
}: FormTextFieldProps) {
  const id = useId()
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field
      className={className}
      data-invalid={invalid}
      data-disabled={inputProps.disabled}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        {...inputProps}
        id={id}
        name={field.name}
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
      />
      {invalid && (
        <FieldError id={`${id}-error`} errors={field.state.meta.errors} />
      )}
    </Field>
  )
}
