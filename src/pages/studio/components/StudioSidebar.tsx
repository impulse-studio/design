import { AccountMenu } from "@/components/auth/AccountMenu"
import { TeamSwitcher } from "@/components/workspace/TeamSwitcher"
import type { TeamSummary } from "@/features/teams/types"
import { Link } from "@tanstack/react-router"
import {
  RiAddLine,
  RiArtboardLine,
  RiTimeLine,
  RiShapesLine,
  RiArrowRightUpLine,
  RiTeamLine,
} from "@remixicon/react"
import type { MockupSummary } from "@/features/mockups/types"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/shared/BrandMark"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { APP_ROUTES, PROJECT_NAME } from "@/constants"

export function StudioSidebar({
  records,
  recent,
  onRecentChange,
  onCreate,
  pending,
  team,
  teams,
  canEdit,
}: {
  records: MockupSummary[]
  recent: boolean
  onRecentChange: (recent: boolean) => void
  onCreate: () => void
  pending: boolean
  team: TeamSummary
  teams: TeamSummary[]
  canEdit: boolean
}) {
  return (
    <Sidebar variant="inset" className="studio-sidebar [&_[data-slot=sidebar-header]]:pt-3 [&_[data-slot=sidebar-header]]:pb-2 [&_[data-slot=sidebar-header]]:px-1 [&_[data-slot=sidebar-header]]:gap-4 [&_[data-slot=sidebar-header]_>_[data-slot=button]]:bg-sidebar-accent [&_[data-slot=sidebar-header]_>_[data-slot=button]]:border-sidebar-border [&_[data-slot=sidebar-header]_>_[data-slot=button]]:text-sidebar-foreground [&_[data-slot=sidebar-header]_>_[data-slot=button]]:font-normal [&_[data-slot=sidebar-group]]:py-2 [&_[data-slot=sidebar-group]]:px-1 [&_[data-slot=sidebar-menu]]:gap-0.5 [&_[data-slot=sidebar-group-label]]:h-[28px] [&_[data-slot=sidebar-group-label]]:text-[12px] [&_[data-slot=sidebar-group-label]]:pl-2 [&_[data-slot=sidebar-group-label]]:mb-2 [&_[data-slot=sidebar-group-label]]:text-sidebar-foreground [@media(hover:hover)_and_(pointer:fine)]:[&_[data-slot=sidebar-header]_>_[data-slot=button]:hover]:[background:var(--control-hover)] [@media(hover:hover)_and_(pointer:fine)]:[&_[data-slot=sidebar-header]_>_[data-slot=button]:hover]:text-foreground [@media(pointer:coarse)]:[&_[data-slot=sidebar-menu-button]]:min-h-[44px]">
      <SidebarHeader>
        <div className="studio-workspace flex items-center min-h-[32px] gap-2 px-1 text-foreground text-[13px] font-medium tracking-[-0.012em]">
          <BrandMark compact />
          <span>{PROJECT_NAME}</span>
        </div>
        <TeamSwitcher teams={teams} activeId={team.id} />
        <Button
          variant="outline"
          className="w-full"
          onClick={onCreate}
          disabled={pending || !canEdit}
        >
          <RiAddLine data-icon="inline-start" />
          Nouvelle maquette
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to={APP_ROUTES.teams} />}>
                <RiTeamLine />
                <span>Équipes et membres</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={!recent}
                onClick={() => onRecentChange(false)}
              >
                <RiArtboardLine />
                <span>Toutes les maquettes</span>
                <span className="ml-auto text-muted-foreground">
                  {records.length}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={recent}
                onClick={() => onRecentChange(true)}
              >
                <RiTimeLine />
                <span>Derniers 7 jours</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton render={<Link to="/libraries"/>}><RiShapesLine/><span>Bibliothèques</span></SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to={APP_ROUTES.designSystem} />}>
                <RiShapesLine />
                <span>Design system</span>
                <RiArrowRightUpLine className="ml-auto" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {records.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Récemment modifiées</SidebarGroupLabel>
            <SidebarMenu>
              {records.slice(0, 5).map((record) => (
                <SidebarMenuItem key={record.id}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={APP_ROUTES.editor}
                        params={{ mockupId: record.id }}
                      />
                    }
                  >
                    <RiArtboardLine />
                    <span>{record.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="studio-sidebar-footer flex gap-2 items-center [padding:6px_0] [&_>_div]:flex [&_>_div]:flex-1 [&_>_div]:flex-col [&_>_div]:text-[12px] [&_>_div]:gap-0.5 [&_small]:text-muted-foreground [&_small]:text-[11px]">
          <AccountMenu />
          <div>
            <span>Digitevent</span>
            <small>{canEdit ? "Espace de création" : "Lecture seule"}</small>
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
