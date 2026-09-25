import { RiSearchLine, RiCloseLine } from "@remixicon/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"

export function SearchField({
  value,
  onValueChange,
  placeholder = "Rechercher…",
  label = "Rechercher",
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Effacer la recherche"
            onClick={() => onValueChange("")}
          >
            <RiCloseLine />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
