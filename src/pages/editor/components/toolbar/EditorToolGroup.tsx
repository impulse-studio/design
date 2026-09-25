import type { ReactNode } from "react"
import { RiArrowDownSLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import type { Tool } from "@/features/editor/types"

export function EditorToolGroup({
  value,
  label,
  children,
  options,
}: {
  value: Tool
  label: string
  children: ReactNode
  options?: { label: string; shortcut?: string; onSelect: () => void }[]
}) {
  return (
    <div className="editor-tool-group flex items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value={value}
              aria-label={label}
              className="editor-tool grid place-items-center w-[34px] h-[34px] [padding:0] rounded-[9px] [&[data-pressed]]:[background:var(--editor-selection)] [&[data-pressed]]:text-white [&_svg]:w-[18px] [&_svg]:h-[18px]"
            />
          }
        >
          {children}
        </TooltipTrigger>
        <TooltipContent side="top">{label}</TooltipContent>
      </Tooltip>
      {options && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                className="editor-tool-chevron"
                aria-label={`Options ${label.split(" · ")[0]}`}
              />
            }
          >
            <RiArrowDownSLine />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={16}
            className="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px] w-60"
          >
            <DropdownMenuGroup>
              {options.map((option) => (
                <DropdownMenuItem key={option.label} onClick={option.onSelect}>
                  {option.label}
                  {option.shortcut && (
                    <DropdownMenuShortcut>
                      {option.shortcut}
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
