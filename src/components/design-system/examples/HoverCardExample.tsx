import source from "./HoverCardExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"

export function HoverCardExample() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <a
            href="/design-system"
            className={buttonVariants({ variant: "link" })}
          />
        }
      >
        @équipe-design
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>DG</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">Équipe Design</p>
            <p className="body-copy text-[13px] leading-[1.55]">
              Une bibliothèque commune pour concevoir ensemble.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
// @example:end

export const getCode = createExampleCode(source)
