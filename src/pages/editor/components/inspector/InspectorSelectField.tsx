import { SelectField } from "@/components/shared/fields/SelectField"
import { cn } from "@/lib/utils"

type InspectorSelectFieldProps<T extends string> = Omit<
  Parameters<typeof SelectField<T>>[0],
  "className" | "contentClassName"
>

export function InspectorSelectField<T extends string>({
  placeholder = "Mixte",
  triggerClassName,
  ...props
}: InspectorSelectFieldProps<T>) {
  return (
    <SelectField
      {...props}
      placeholder={placeholder}
      triggerClassName={cn(
        "h-6 min-h-6 rounded-[5px] border border-transparent bg-muted px-[7px] text-[11px] font-normal shadow-none focus-visible:border-[var(--editor-selection)] pointer-coarse:min-h-6",
        triggerClassName
      )}
      contentClassName="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px]"
    />
  )
}
