import source from "./AISidebarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { AISidebar } from "@/components/shared/ai-sidebar/AISidebar"
import type { SidebarResource } from "@/components/shared/ai-sidebar/types"
import { Button } from "@/components/ui/button"

const resources: SidebarResource[] = [
  {
    id: "project",
    label: "Événement annuel",
    kind: "project",
    children: [
      {
        id: "pages",
        label: "Pages",
        kind: "folder",
        children: [
          { id: "registration", label: "Inscription.tsx", kind: "file" },
          { id: "confirmation", label: "Confirmation.tsx", kind: "file" },
        ],
      },
      { id: "brief", label: "Brief du projet.md", kind: "file" },
    ],
  },
  { id: "design", label: "Design system", kind: "bookmark" },
  { id: "archive", label: "Archives", kind: "folder", children: [] },
]

export function AISidebarExample() {
  const [revision, setRevision] = useState(0)
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="rounded-xl border bg-sidebar p-3">
        <AISidebar
          key={revision}
          defaultItems={resources}
          defaultExpandedIds={["project", "pages"]}
          defaultActiveId="registration"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="self-end"
        onClick={() => setRevision((value) => value + 1)}
      >
        Réinitialiser
      </Button>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
