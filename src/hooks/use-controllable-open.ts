import { useState, useCallback } from "react"

export const useControllableOpen = ({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const controlled = open !== undefined
  const currentOpen = open ?? internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [controlled, onOpenChange]
  )

  return [currentOpen, setOpen] as const
}
