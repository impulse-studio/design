import source from "./CalendarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { fr } from "date-fns/locale"

export function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 8, 24))
  return (
    <Calendar
      mode="single"
      locale={fr}
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 8, 1)}
      className="rounded-lg border"
    />
  )
}
// @example:end

export const getCode = createExampleCode(source)
