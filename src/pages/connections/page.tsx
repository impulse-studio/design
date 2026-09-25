import { useState } from "react"
import { Link, useLoaderData, useRouter } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOrpc } from "@/server/use-orpc"

export function ConnectionsPage() {
  const connections = useLoaderData({ from: "/connections" })
  const router = useRouter(),
    queryClient = useQueryClient(),
    orpc = useOrpc(),
    revoke = useMutation(orpc.mcp.revokeConnection.mutationOptions())
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const remove = async (id: string) => {
    setPendingId(id)
    setError(null)
    try {
      await revoke.mutateAsync({ id })
      await queryClient.invalidateQueries({
        queryKey: orpc.mcp.listConnections.queryKey(),
      })
      await router.invalidate()
    } catch {
      setError("Impossible de retirer cet accès. Réessayez.")
    } finally {
      setPendingId(null)
    }
  }
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <Button variant="ghost" render={<Link to="/" />} className="self-start">
        Retour aux maquettes
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Connexions MCP</CardTitle>
          <CardDescription>
            Applications autorisées à accéder à tes maquettes. Retirer un accès
            bloque les prochains appels.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {connections.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucune application connectée.
            </p>
          )}
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {connection.name || connection.clientId}
                </p>
                <p className="text-sm text-muted-foreground">
                  {connection.scopes.includes("mcp:write")
                    ? "Lecture et modification"
                    : "Lecture"}
                </p>
              </div>
              <Button
                variant="outline"
                disabled={pendingId !== null}
                onClick={() => void remove(connection.id)}
              >
                Retirer l’accès
              </Button>
            </div>
          ))}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
