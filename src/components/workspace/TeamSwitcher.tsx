import { authClient } from "@/features/auth/client"
import type { TeamSummary } from "@/features/teams/types"
import { useTeamAction } from "@/features/teams/use-team-action"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"

export function TeamSwitcher({
  teams,
  activeId,
}: {
  teams: TeamSummary[]
  activeId: string
}) {
  const { run, pending, error } = useTeamAction()
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <Select
        value={activeId}
        disabled={pending}
        onValueChange={(id) => {
          if (id)
            void run(
              () => authClient.organization.setActive({ organizationId: id }),
              "Impossible de changer d’équipe."
            )
        }}
      >
        <SelectTrigger className="w-full" aria-label="Équipe active">
          <SelectValue>
            {teams.find((team) => team.id === activeId)?.name}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
