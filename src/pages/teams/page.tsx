import { Link, useLoaderData, useRouteContext } from "@tanstack/react-router"
import { RiArrowLeftLine } from "@remixicon/react"
import { AccountMenu } from "@/components/auth/AccountMenu"
import { TeamSwitcher } from "@/components/workspace/TeamSwitcher"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  canManageMembers,
  roleDescriptions,
  roleLabels,
} from "@/features/teams/permissions"
import { CreateTeamForm } from "./components/CreateTeamForm"
import { InviteMemberForm } from "./components/InviteMemberForm"
import { TeamMembers } from "./components/TeamMembers"
import { TeamInvitations } from "./components/TeamInvitations"
import { TeamSettings } from "./components/TeamSettings"
import { APP_ROUTES } from "@/constants"

export function TeamsPage() {
  const { teams, activeTeam, members, invitations, receivedInvitations } =
    useLoaderData({ from: APP_ROUTES.teams })
  const { user } = useRouteContext({ from: "__root__" })
  const canManage = activeTeam ? canManageMembers(activeTeam.role) : false
  return (
    <main className="min-h-svh bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to={APP_ROUTES.studio}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <RiArrowLeftLine data-icon="inline-start" />
          Studio
        </Link>
        <AccountMenu />
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Équipes et membres
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organisez vos espaces de travail et choisissez qui peut y accéder.
            </p>
          </div>
          {activeTeam && (
            <div className="w-64">
              <TeamSwitcher teams={teams} activeId={activeTeam.id} />
            </div>
          )}
        </div>
        <TeamInvitations invitations={receivedInvitations} received />
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
          <div className="flex min-w-0 flex-col gap-6">
            {activeTeam ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{activeTeam.name}</CardTitle>
                    <CardDescription>
                      {members.length} membre{members.length > 1 ? "s" : ""} ·
                      Les maquettes sont partagées au sein de cette équipe.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {canManage && (
                      <InviteMemberForm
                        key={activeTeam.id}
                        organizationId={activeTeam.id}
                        isOwner={activeTeam.role === "owner"}
                      />
                    )}
                    <TeamMembers
                      key={`${activeTeam.id}:${activeTeam.role}`}
                      members={members}
                      organizationId={activeTeam.id}
                      currentUserId={user!.id}
                      role={activeTeam.role}
                    />
                  </CardContent>
                </Card>
                <TeamInvitations
                  invitations={invitations}
                  canCancel={canManage}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Réglages de l’équipe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TeamSettings
                      key={activeTeam.id + activeTeam.name}
                      team={activeTeam}
                      canManage={canManage}
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Votre première équipe</CardTitle>
                  <CardDescription>
                    Créez un espace de travail ou acceptez une invitation pour
                    commencer à concevoir.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
          <aside className="flex flex-col gap-6">
            <CreateTeamForm />
            <Card>
              <CardHeader>
                <CardTitle>Les permissions</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(roleLabels).map(([role, label]) => (
                  <div key={role}>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {roleDescriptions[role as keyof typeof roleDescriptions]}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
