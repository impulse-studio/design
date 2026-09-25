import {
  RiCheckboxBlankCircleLine,
  RiLoader2Line,
  RiContrast2Line,
  RiCheckboxCircleFill,
} from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { mockupStatuses, mockupStatusSchema } from "@/features/mockups/status"
import type { MockupStatus } from "@/features/mockups/status"

const icons = {
  draft: RiCheckboxBlankCircleLine,
  in_progress: RiContrast2Line,
  in_review: RiLoader2Line,
  approved: RiCheckboxCircleFill,
}
export function MockupStatusMenu({
  value,
  onChange,
  disabled = false,
  compact = false,
}: {
  value: MockupStatus
  onChange: (value: MockupStatus) => void
  disabled?: boolean
  compact?: boolean
}) {
  const Icon = icons[value]
  const label = mockupStatuses.find((status) => status.value === value)!.label
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size={compact ? "icon-sm" : "sm"}
            className={
              compact
                ? "size-7 min-h-11 min-w-11 shrink-0 p-0 text-muted-foreground data-[status=approved]:text-emerald-600 data-[status=draft]:text-muted-foreground data-[status=in_progress]:text-amber-600 data-[status=in_review]:text-violet-500 md:min-h-7 md:min-w-7"
                : "mockup-status text-[11px] h-[25px] px-1 font-normal gap-1.25 [&[data-status=draft]_>_svg]:text-muted-foreground [&[data-status=in_progress]_>_svg]:[color:#d8a743] [&[data-status=in_review]_>_svg]:[color:#8b80f9] [&[data-status=approved]_>_svg]:[color:#4ca884]"
            }
            data-status={value}
            disabled={disabled}
            aria-label={`Statut : ${label}`}
          />
        }
      >
        <Icon data-icon="inline-start" />
        {!compact && label}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(mockupStatusSchema.parse(next))}
        >
          {mockupStatuses.map((status) => {
            const StatusIcon = icons[status.value]
            return (
              <DropdownMenuRadioItem
                value={status.value}
                key={status.value}
                className="mockup-status-option [&[data-status=draft]_>_svg]:text-muted-foreground [&[data-status=in_progress]_>_svg]:[color:#d8a743] [&[data-status=in_review]_>_svg]:[color:#8b80f9] [&[data-status=approved]_>_svg]:[color:#4ca884]"
                data-status={status.value}
              >
                <StatusIcon />
                {status.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
