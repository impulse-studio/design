import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AiProposal } from "@/features/ai/types"

export function MockupProposalCard({
  proposal,
  busy,
  readOnly,
  saving,
  onApply,
  onReject,
}: {
  proposal: AiProposal
  busy: boolean
  readOnly: boolean
  saving: boolean
  onApply: () => Promise<void>
  onReject: () => Promise<void>
}) {
  return (
    <Card size="sm" className="mt-3">
      <CardHeader>
        <CardTitle>Modification proposée</CardTitle>
        <CardDescription>{proposal.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {proposal.operations.length} opération
          {proposal.operations.length > 1 ? "s" : ""} · annulation disponible
          après application
        </p>
        {proposal.status !== "pending" && (
          <Badge variant="outline" className="w-fit">
            {proposal.status === "applied" ? "Appliquée" : "Refusée"}
          </Badge>
        )}
        {readOnly && proposal.status === "pending" && (
          <p className="text-muted-foreground">
            Passez en édition pour appliquer cette proposition.
          </p>
        )}
      </CardContent>
      {proposal.status === "pending" && (
        <CardFooter className="gap-2">
          <Button
            size="sm"
            disabled={busy || readOnly}
            onClick={() => void onApply()}
          >
            {saving ? "Vérifier la sauvegarde" : "Appliquer"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy || readOnly || saving}
            onClick={() => void onReject()}
          >
            Refuser
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
