import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"
import { authClient } from "@/features/auth/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ConsentPage() {
  const { client_id: clientId, scope } = useSearch({ from: "/consent" })
  const [name, setName] = useState("cette application")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (!clientId) return
    void authClient.oauth2
      .publicClient({ query: { client_id: clientId } })
      .then(({ data }) => {
        if (data?.client_name) setName(data.client_name)
      })
  }, [clientId])
  const decide = async (accept: boolean) => {
    setPending(true)
    setError(null)
    try {
      const response = await authClient.oauth2.consent({ accept })
      if (response.error || !response.data.url)
        throw new Error("La connexion n’a pas abouti.")
      window.location.assign(response.data.url)
    } catch {
      setError("La connexion n’a pas abouti. Réessayez.")
      setPending(false)
    }
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Autoriser {name} ?</CardTitle>
          <CardDescription>
            Cette application demande l’accès à tes maquettes Digit AI Studio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          {scope?.includes("mcp:read") && (
            <p>Lire tes maquettes et le catalogue de composants.</p>
          )}
          {scope?.includes("mcp:write") && (
            <p>Modifier directement les maquettes que tu peux éditer.</p>
          )}
          <p className="text-muted-foreground">
            Tu peux retirer cet accès depuis Connexions dans le menu de ton
            compte.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => void decide(false)}
          >
            Refuser
          </Button>
          <Button
            disabled={pending || !clientId}
            aria-busy={pending}
            onClick={() => void decide(true)}
          >
            Autoriser
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
