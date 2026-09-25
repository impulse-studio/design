import { useState } from "react"
import { Link, useRouteContext } from "@tanstack/react-router"
import { RiLogoutBoxLine, RiTeamLine, RiLink } from "@remixicon/react"
import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/toast"
import { APP_ROUTES } from "@/constants"

export function AccountMenu() {
  const { user } = useRouteContext({ from: "__root__" })
  const [pending, setPending] = useState(false)
  if (!user) return null
  const signOut = async () => {
    setPending(true)
    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error("Déconnexion impossible")
      window.location.assign(APP_ROUTES.login)
    } catch {
      toast.add({ title: "La déconnexion a échoué. Réessayez.", type: "error" })
      setPending(false)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={`Compte de ${user.name}`}
            disabled={pending}
          />
        }
      >
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt="" />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate">{user.name}</span>
            <span className="block truncate">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuItem render={<Link to={APP_ROUTES.teams} />}>
            <RiTeamLine />
            Équipes et membres
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/connections" />}>
            <RiLink />
            Connexions MCP
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => void signOut()} disabled={pending}>
            <RiLogoutBoxLine />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
