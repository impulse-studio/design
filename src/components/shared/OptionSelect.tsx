import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

export function OptionSelect({
  value,
  onValueChange,
  options,
  label,
  placeholder = "Sélectionner…",
  id,
  disabled,
  triggerClassName,
}: {
  value: string
  onValueChange: (value: string) => void
  options: Option[]
  label: string
  placeholder?: string
  id?: string
  disabled?: boolean
  triggerClassName?: string
}) {
  return (
    <Select
      value={value || null}
      onValueChange={(next) => {
        if (next !== null) onValueChange(next)
      }}
      items={options}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        aria-label={label}
        className={cn("w-full min-w-0", triggerClassName)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
