import source from "./AgentActivityExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useEffect, useState } from "react"
import { AgentActivity } from "@/components/shared/agent-activity/AgentActivity"
import type { AgentActivityItem } from "@/components/shared/agent-activity/types"
import { Button } from "@/components/ui/button"

const activity: AgentActivityItem[] = [
  {
    id: "plan",
    type: "step",
    label: "Préparer la page d’inscription",
    status: "complete",
  },
  {
    id: "search",
    type: "search",
    query: "Composants de formulaire accessibles",
    results: [
      {
        id: "shadcn",
        title: "shadcn/ui",
        domain: "ui.shadcn.com",
        url: "https://ui.shadcn.com",
      },
    ],
  },
  {
    id: "read",
    type: "tool",
    action: "read",
    target: "src/pages/RegistrationPage.tsx",
  },
  {
    id: "edit",
    type: "tool",
    action: "edit",
    target: "src/pages/RegistrationPage.tsx",
    additions: 24,
    deletions: 6,
  },
  {
    id: "run",
    type: "trace",
    kind: "run",
    label: "Vérification",
    detail: "pnpm test",
  },
  {
    id: "result",
    type: "text",
    content: "Simulation terminée : la page et ses tests sont prêts.",
  },
]

export function AgentActivityExample() {
  const [count, setCount] = useState(1)
  const [running, setRunning] = useState(true)
  const working = running && count <= activity.length
  useEffect(() => {
    if (!working) return
    const timer = window.setTimeout(() => setCount((value) => value + 1), 1000)
    return () => window.clearTimeout(timer)
  }, [count, working])
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <AgentActivity
        items={activity.slice(0, count)}
        status={working ? "working" : "complete"}
        duration={count}
        maxHeight={208}
      />
      <div className="flex justify-end gap-2">
        {working && (
          <Button variant="ghost" size="sm" onClick={() => setRunning(false)}>
            Arrêter
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCount(1)
            setRunning(true)
          }}
        >
          Relancer
        </Button>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
