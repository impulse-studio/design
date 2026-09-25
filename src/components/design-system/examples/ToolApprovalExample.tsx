import source from "./ToolApprovalExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useEffect, useState } from "react"
import { ToolApproval } from "@/components/shared/tool-approval/ToolApproval"
import { ToolApprovalCode } from "@/components/shared/tool-approval/ToolApprovalCode"
import type { ToolApprovalStatus } from "@/components/shared/tool-approval/types"
import { Button } from "@/components/ui/button"

export function ToolApprovalExample() {
  const [status, setStatus] = useState<ToolApprovalStatus>("pending")
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (status !== "approving" && status !== "running") return
    const timer = window.setTimeout(
      () => setStatus(status === "approving" ? "running" : "complete"),
      1000
    )
    return () => window.clearTimeout(timer)
  }, [status])
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ToolApproval
        key={revision}
        tool="terminal.execute"
        description="Lancer les tests du projet. Exécution simulée pour cet aperçu."
        status={status}
        parameters={[
          {
            id: "command",
            label: "Commande",
            value: <ToolApprovalCode code="pnpm test" />,
          },
          { id: "directory", label: "Dossier", value: "/workspace/app" },
        ]}
        onApprove={() => setStatus("approving")}
        onAlwaysAllow={() => setStatus("approved")}
        onDeny={() => setStatus("denied")}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStatus("pending")
            setRevision((value) => value + 1)
          }}
        >
          Réinitialiser
        </Button>
        <Button variant="outline" size="sm" onClick={() => setStatus("error")}>
          Simuler une erreur
        </Button>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
