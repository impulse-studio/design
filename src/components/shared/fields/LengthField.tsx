import type { ReactNode } from "react"
import type { Length } from "@digit-ai-studio/shared"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { RiArrowDownSLine } from "@remixicon/react"
import { NumberField } from "./NumberField"

export function LengthField({
  label,
  value,
  onChange,
  tokens,
  min = 0,
  prefix,
  placeholder,
  resolvedValue,
}: {
  label: string
  value: Length | undefined
  onChange: (value: Length) => void
  /** Token names the value can be bound to. */
  tokens: string[]
  min?: number
  prefix?: ReactNode
  placeholder?: string
  resolvedValue?: number
}) {
  const customValue = typeof value === "number" ? value : resolvedValue
  const useCustom =
    customValue === undefined ? undefined : () => onChange(customValue)
  return (
    <div className="editor-length-field flex items-center gap-[0] min-w-0 [&_>_.editor-number-field]:flex-1 [&_.editor-scrub-label]:text-[9px] [&_.editor-number-field_>_input]:pl-9">
      {typeof value === "object" ? (
        <Button
          variant="outline"
          size="sm"
          className="min-w-0 flex-1 justify-start"
          disabled={!useCustom}
          onClick={useCustom}
          aria-label={`${label} : ${value.token}, utiliser une valeur libre`}
        >
          <span className="text-muted-foreground">{prefix ?? label}</span>
          <span className="truncate">{value.token}</span>
        </Button>
      ) : (
        <NumberField
          label={label}
          prefix={prefix}
          placeholder={placeholder}
          value={value}
          min={min}
          onChange={onChange}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Tokens ${label}`}
            />
          }
        >
          <RiArrowDownSLine />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={!useCustom} onClick={useCustom}>
              Valeur personnalisée
            </DropdownMenuItem>
            {tokens.map((name) => (
              <DropdownMenuItem
                key={name}
                onClick={() => onChange({ token: name })}
              >
                {name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
