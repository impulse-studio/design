import source from "./ApprovalCardExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { ApprovalCard } from "@/components/shared/approval/ApprovalCard"
import type { ApprovalCardStatus } from "@/components/shared/approval/types"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ApprovalCardExample() {
  const [status, setStatus] = useState<ApprovalCardStatus>("pending")
  const [mode, setMode] = useState("approval")
  const [revision, setRevision] = useState(0)
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ToggleGroup
        value={[mode]}
        onValueChange={(values) => {
          if (!values[0]) return
          setMode(values[0])
          setStatus("pending")
          setRevision((value) => value + 1)
        }}
        aria-label="Type de validation"
      >
        <ToggleGroupItem value="approval">Approbation</ToggleGroupItem>
        <ToggleGroupItem value="questions">Questions</ToggleGroupItem>
      </ToggleGroup>
      <ApprovalCard
        key={revision}
        title="Valider le plan"
        description="Créer la page d’inscription et configurer les confirmations par e-mail."
        status={status}
        questions={
          mode === "questions"
            ? [
                {
                  id: "access",
                  title: "Quel accès pour l’événement ?",
                  options: [
                    { value: "public", label: "Public" },
                    { value: "invite", label: "Sur invitation" },
                  ],
                  allowCustom: true,
                },
                {
                  id: "features",
                  title: "Quelles fonctionnalités activer ?",
                  multiple: true,
                  options: [
                    { value: "email", label: "Confirmation par e-mail" },
                    { value: "waitlist", label: "Liste d’attente" },
                  ],
                  allowCustom: true,
                },
              ]
            : []
        }
        onApprove={() => setStatus("approved")}
        onReject={() => setStatus("rejected")}
        onRequestChanges={() => setStatus("changes-requested")}
        onSubmit={() => setStatus("answered")}
      />
      <Button
        variant="ghost"
        className="self-end"
        onClick={() => {
          setStatus("pending")
          setRevision((value) => value + 1)
        }}
      >
        Réinitialiser
      </Button>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
