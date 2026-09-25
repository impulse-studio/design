import { useId } from "react"
import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder,
  hideLabel = false,
  className,
  triggerClassName,
  contentClassName,
}: {
  label: string
  value: T | undefined
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  disabled?: boolean
  placeholder?: string
  hideLabel?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
}) {
  const id = useId()
  return (
    <Field className={cn("gap-1.5", className)}>
      <FieldLabel htmlFor={id} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <Select
        items={options}
        value={value ?? null}
        onValueChange={(next) => {
          if (next !== null) onChange(next)
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size="sm"
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={contentClassName}
          alignItemWithTrigger={false}
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
