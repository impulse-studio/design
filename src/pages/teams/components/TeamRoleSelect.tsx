import { isTeamRole, roleLabels } from "@/features/teams/permissions"
import type { TeamRole } from "@/features/teams/permissions"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"

export function TeamRoleSelect({
  value,
  onChange,
  allowOwner = false,
  disabled = false,
  label = "Rôle",
  id,
  onBlur,
  invalid = false,
}: {
  value: string
  onChange: (role: TeamRole) => void
  allowOwner?: boolean
  disabled?: boolean
  label?: string
  id?: string
  onBlur?: () => void
  invalid?: boolean
}) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(role) => {
        if (role && isTeamRole(role)) onChange(role)
      }}
    >
      <SelectTrigger
        id={id}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={invalid && id ? `${id}-error` : undefined}
        aria-label={label}
        className="w-full min-w-36"
      >
        <SelectValue>
          {isTeamRole(value) ? roleLabels[value] : value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(roleLabels)
            .filter(([role]) => allowOwner || role !== "owner")
            .map(([role, name]) => (
              <SelectItem key={role} value={role}>
                {name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
