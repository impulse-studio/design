import { createFileRoute } from "@tanstack/react-router"
import { LibrariesPage } from "@/pages/libraries/page"
import { requireAuthenticatedUser } from "@/features/auth/route-guard"

export const Route=createFileRoute("/libraries")({beforeLoad:({context,location})=>requireAuthenticatedUser(context.user,location.pathname),component:LibrariesPage})
