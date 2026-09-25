import type { ReactNode } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ModeSwitchOption<Value extends string> = {
  value: Value
  label: string
  icon: ReactNode
  shortcut?: string
  disabled?: boolean
}

export function ModeSwitch<Value extends string>({
  value,
  options,
  ariaLabel,
  onValueChange,
}: {
  value: Value
  options: readonly ModeSwitchOption<Value>[]
  ariaLabel: string
  onValueChange: (value: Value) => void
}) {
  return (
    <ToggleGroup
      className="editor-mode-switch [&_[data-slot=toggle-group-item]]:h-[28px] [&_[data-slot=toggle-group-item]]:w-[28px] [&_[data-slot=toggle-group-item]]:min-w-[28px] [&_[data-slot=toggle-group-item]]:[padding:0] [&_[data-slot=toggle-group-item]]:rounded-sm [&_[data-slot=toggle-group-item]]:text-muted-foreground [&_[data-slot=toggle-group-item]_svg]:w-[19px] [&_[data-slot=toggle-group-item]_svg]:h-[19px] [&_[aria-pressed=true]]:[color:var(--editor-selection)] [&_[aria-pressed=true]]:bg-background [&_[aria-pressed=true]]:shadow-[0_1px_4px_#00000026]"
      value={[value]}
      spacing={1}
      aria-label={ariaLabel}
      onValueChange={(values) => {
        const next = options.find((item) => item.value === values[0])
        if (next) onValueChange(next.value)
      }}
    >
      {options.map(({ value: optionValue, label, icon, shortcut, disabled }) => (
        <Tooltip key={optionValue}>
          <TooltipTrigger
            render={
              <ToggleGroupItem
                value={optionValue}
                aria-label={label}
                disabled={disabled}
              />
            }
          >
            {icon}
          </TooltipTrigger>
          <TooltipContent side="top">
            {shortcut ? `${label} · ${shortcut}` : label}
          </TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  )
}
