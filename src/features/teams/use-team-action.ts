import { useRef, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useOrpc } from "@/server/use-orpc"

export const useTeamAction = () => {
  const router = useRouter(),
    queryClient = useQueryClient(),
    orpc = useOrpc()
  const busy = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const run = async (
    action: () => Promise<{
      error: { message?: string; code?: string } | null
    }>,
    message: string
  ) => {
    if (busy.current) return false
    busy.current = true
    setPending(true)
    setError(null)
    try {
      const result = await action()
      if (result.error) {
        setError(
          result.error.code ===
            "YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER"
            ? "Nommez un autre propriétaire avant de quitter l’équipe ou de changer votre rôle."
            : message
        )
        return false
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orpc.auth.getCurrentUser.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: orpc.teams.getOverview.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: orpc.mockups.list.queryKey(),
        }),
      ])
      await router.invalidate()
      return true
    } catch {
      setError(message)
      return false
    } finally {
      busy.current = false
      setPending(false)
    }
  }
  return { run, pending, error }
}
