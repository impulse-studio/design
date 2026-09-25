import { useState } from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import { Kbd } from "@/components/ui/kbd"
import { StatusIcon } from "./StatusIcon"
import { statusOptions, statusLabels } from "@/features/design-system/status"
import type { StatusValue } from "@/features/design-system/status"

export function StatusPicker({
  value,
  onValueChange,
  disabled,
  variant = "ghost",
  label = "Statut",
}: {
  value: StatusValue
  onValueChange: (value: StatusValue) => void
  disabled?: boolean
  variant?: "default" | "subtle" | "ghost"
  label?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      items={statusOptions}
      value={value}
      onValueChange={(next) => {
        if (next) {
          onValueChange(next)
          setOpen(false)
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger aria-label={label} variant={variant} size="sm">
        <StatusIcon status={value} />
        <SelectValue>{statusLabels[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent
        align="start"
        className="min-w-52"
        onKeyDown={(event) => {
          const option = statusOptions.find(
            (status) => status.shortcut === event.key
          )
          if (option) {
            event.preventDefault()
            onValueChange(option.value)
            setOpen(false)
          }
        }}
      >
        <div className="border-b px-3 py-2 text-xs text-muted-foreground">
          Changer le statut
        </div>
        <SelectGroup>
          {statusOptions.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <StatusIcon status={status.value} />
              <span className="flex-1">{status.label}</span>
              <Kbd className="ml-4">{status.shortcut}</Kbd>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
