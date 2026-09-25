import type { ReactNode } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ModeSwitchOption<TValue extends string> = {
  value: TValue
  label: string
  icon: ReactNode
  shortcut?: string
  disabled?: boolean
}

export function ModeSwitch<TValue extends string>({
  value,
  options,
  ariaLabel,
  onValueChange,
}: {
  value: TValue
  options: readonly ModeSwitchOption<TValue>[]
  ariaLabel: string
  onValueChange: (value: TValue) => void
}) {
  return (
    <ToggleGroup
      className="editor-mode-switch min-w-0"
      value={[value]}
      spacing={1}
      aria-label={ariaLabel}
      onValueChange={(values) => {
        const next = options.find((item) => item.value === values[0])
        if (next) onValueChange(next.value)
      }}
    >
      {options.map(
        ({ value: optionValue, label, icon, shortcut, disabled }) => (
          <Tooltip key={optionValue}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={optionValue}
                  aria-label={label}
                  disabled={disabled}
                  className="size-9 min-w-9 rounded-lg border-0 bg-transparent p-0 text-muted-foreground shadow-none transition-colors duration-(--motion-fast) ease-(--motion-ease-out) hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/50 aria-pressed:bg-muted aria-pressed:text-foreground motion-reduce:transition-none [&_svg]:size-4 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground [@media(hover:none),_(pointer:coarse)]:size-11 [@media(hover:none),_(pointer:coarse)]:min-w-11"
                />
              }
            >
              {icon}
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={10}>
              {shortcut ? `${label} · ${shortcut}` : label}
            </TooltipContent>
          </Tooltip>
        )
      )}
    </ToggleGroup>
  )
}
