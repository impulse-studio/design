import { LibraryPermission } from "./LibraryPermission"
import { useState } from "react"
import { authClient } from "@/features/auth/client"
import { useTeamAction } from "@/features/teams/use-team-action"
import type { TeamMember } from "@/features/teams/types"
import { isTeamRole, roleLabels } from "@/features/teams/permissions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { TeamRoleSelect } from "./TeamRoleSelect"

export function TeamMembers({
  members,
  organizationId,
  currentUserId,
  role,
}: {
  members: TeamMember[]
  organizationId: string
  currentUserId: string
  role: string
}) {
  const { run, pending, error } = useTeamAction()
  const [removing, setRemoving] = useState<TeamMember | null>(null)
  const canManage = role === "owner" || role === "admin"
  const owners = members.filter((member) => member.role === "owner").length
  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membre</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Gérer les bibliothèques</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const lastOwner = member.role === "owner" && owners === 1
            const editable =
              canManage &&
              (role === "owner" || member.role !== "owner") &&
              !lastOwner
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <span className="block font-medium">
                    {member.name}
                    {member.userId === currentUserId ? " (vous)" : ""}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </TableCell>
                <TableCell>
                  {editable ? (
                    <TeamRoleSelect
                      label={`Rôle de ${member.name}`}
                      value={member.role}
                      disabled={pending}
                      allowOwner={role === "owner"}
                      onChange={(newRole) =>
                        void run(
                          () =>
                            authClient.organization.updateMemberRole({
                              organizationId,
                              memberId: member.id,
                              role: newRole,
                            }),
                          "Impossible de modifier ce rôle."
                        )
                      }
                    />
                  ) : (
                    <span>
                      {isTeamRole(member.role)
                        ? roleLabels[member.role]
                        : member.role}
                    </span>
                  )}
                </TableCell>
                <TableCell><LibraryPermission organizationId={organizationId} memberId={member.id} name={member.name} enabled={member.role==="owner" || member.canManageLibraries} disabled={role!=="owner" || member.role==="owner"}/></TableCell>
                <TableCell className="text-right">
                  {editable && member.userId !== currentUserId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => setRemoving(member)}
                    >
                      Retirer
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <AlertDialog
        open={!!removing}
        onOpenChange={(open) => {
          if (!open) setRemoving(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer {removing?.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette personne perdra immédiatement l’accès aux maquettes de cette
              équipe. Vous pourrez l’inviter à nouveau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removing)
                  void run(
                    () =>
                      authClient.organization.removeMember({
                        organizationId,
                        memberIdOrEmail: removing.id,
                      }),
                    "Impossible de retirer ce membre."
                  )
              }}
            >
              Retirer le membre
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
