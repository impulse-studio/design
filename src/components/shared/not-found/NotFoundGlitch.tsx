import type { ReactNode } from "react"
import { cn } from "cn"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Scramble } from "./Scramble"

export interface NotFoundGlitchProps {
  code?: string
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

// Adapted from beui.dev/components/blocks/not-found (Glitch).
export function NotFoundGlitch({
  code = "404",
  title = "Page introuvable",
  description,
  actions,
  className,
}: NotFoundGlitchProps) {
  return (
    <Empty className={cn("min-h-[420px] gap-8", className)}>
      <div className="group relative font-mono [font-size:clamp(5rem,18vw,11rem)] leading-none font-bold tracking-tighter text-foreground select-none">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-[#ff0040] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-[#00e5ff] opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:-translate-x-[3px] group-hover:opacity-70 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>
        <h1 className="relative" aria-label={code}>
          <span aria-hidden="true">
            <Scramble text={code} />
          </span>
        </h1>
      </div>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {actions && <EmptyContent>{actions}</EmptyContent>}
    </Empty>
  )
}
