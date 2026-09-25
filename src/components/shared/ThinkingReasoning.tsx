"use client"

import { useState } from "react"
import { RiArrowDownSLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ThinkingState } from "./ThinkingState"

export interface ThinkingReasoningProps {
  active?: boolean
  lines?: string[]
  summary?: string
}

export function ThinkingReasoning({
  active = false,
  lines = [],
  summary = "Résumé de l’activité",
}: ThinkingReasoningProps) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible
      open={active || open}
      onOpenChange={setOpen}
      className="flex min-w-0 flex-col gap-2"
    >
      {active ? (
        <ThinkingState />
      ) : (
        <CollapsibleTrigger
          render={<Button variant="ghost" size="sm" />}
          className="self-start"
        >
          {summary}
          <RiArrowDownSLine data-icon="inline-end" />
        </CollapsibleTrigger>
      )}
      <CollapsibleContent>
        <ul className="flex flex-col gap-2 border-l pl-3 text-xs leading-relaxed text-muted-foreground">
          {lines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
