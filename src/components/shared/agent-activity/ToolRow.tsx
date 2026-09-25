import type { AgentActivityTool } from "./types"
import { ActionIcon } from "./ActionIcon"

export function ToolRow({ item }: { item: AgentActivityTool }) {
  const action =
    (
      {
        read: "Lecture",
        edit: "Modification",
        write: "Écriture",
        run: "Exécution",
      } as Record<string, string>
    )[item.action] ?? item.action

  return (
    <div className="flex min-h-8 min-w-0 items-center gap-2.5 rounded-md px-1.5 py-0.5 leading-5">
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center text-muted-foreground/70"
      >
        <ActionIcon action={item.action} />
      </span>
      <span className="shrink-0 font-medium text-foreground/90">{action}</span>
      <span className="min-w-0 flex-1 truncate rounded-lg bg-muted/80 px-2.5 py-1 font-mono text-xs text-muted-foreground/70">
        {item.target}
      </span>
      {typeof item.additions === "number" ||
      typeof item.deletions === "number" ? (
        <span className="flex shrink-0 items-center gap-2 font-mono tabular-nums">
          {typeof item.additions === "number" ? (
            <span className="text-primary">+{item.additions}</span>
          ) : null}
          {typeof item.deletions === "number" ? (
            <span className="text-destructive">−{item.deletions}</span>
          ) : null}
        </span>
      ) : null}
    </div>
  )
}
