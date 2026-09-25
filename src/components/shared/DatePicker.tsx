import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { RiCalendarLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export function DatePicker({
  value,
  onValueChange,
  disabled = false,
  label = "Choisir une date",
}: {
  value?: Date
  onValueChange: (date: Date | undefined) => void
  disabled?: boolean
  label?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" disabled={disabled} />}
        aria-label={
          value ? `${label} : ${format(value, "PPP", { locale: fr })}` : label
        }
      >
        <RiCalendarLine data-icon="inline-start" />
        {value ? format(value, "d MMMM yyyy", { locale: fr }) : label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" aria-label={label}>
        <Calendar
          mode="single"
          locale={fr}
          labels={{
            labelNav: () => "Navigation du calendrier",
            labelNext: () => "Mois suivant",
            labelPrevious: () => "Mois précédent",
            labelDayButton: (day, modifiers) =>
              format(day, "PPPP", { locale: fr }) +
              (modifiers.today ? ", aujourd’hui" : "") +
              (modifiers.selected ? ", sélectionné" : ""),
          }}
          selected={value}
          onSelect={(date) => {
            onValueChange(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
