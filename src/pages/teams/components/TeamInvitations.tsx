import { authClient } from "@/features/auth/client"
import type { TeamOverview } from "@/features/teams/types"
import { useTeamAction } from "@/features/teams/use-team-action"
import { isTeamRole, roleLabels } from "@/features/teams/permissions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function TeamInvitations({
  invitations,
  received = false,
  canCancel = false,
}: {
  invitations: TeamOverview["invitations"] | TeamOverview["receivedInvitations"]
  received?: boolean
  canCancel?: boolean
}) {
  const { run, pending, error } = useTeamAction()
  if (!invitations.length) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {received ? "Vos invitations" : "Invitations en attente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex flex-wrap items-center justify-between gap-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">
                {"organizationName" in invitation
                  ? invitation.organizationName
                  : invitation.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {invitation.role && isTeamRole(invitation.role)
                  ? roleLabels[invitation.role]
                  : invitation.role}{" "}
                · Expire le{" "}
                {new Intl.DateTimeFormat("fr").format(
                  new Date(invitation.expiresAt)
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {received ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending}
                    onClick={() =>
                      void run(
                        () =>
                          authClient.organization.rejectInvitation({
                            invitationId: invitation.id,
                          }),
                        "Impossible de refuser l’invitation."
                      )
                    }
                  >
                    Refuser
                  </Button>
                  <Button
                    size="sm"
                    disabled={pending}
                    onClick={() =>
                      void run(
                        () =>
                          authClient.organization.acceptInvitation({
                            invitationId: invitation.id,
                          }),
                        "Impossible d’accepter cette invitation. Elle a peut-être expiré ou été annulée."
                      )
                    }
                  >
                    Rejoindre
                  </Button>
                </>
              ) : (
                canCancel && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() =>
                      void run(
                        () =>
                          authClient.organization.cancelInvitation({
                            invitationId: invitation.id,
                          }),
                        "Impossible d’annuler l’invitation."
                      )
                    }
                  >
                    Annuler
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
