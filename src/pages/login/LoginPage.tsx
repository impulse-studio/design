import { useState } from "react"
import { useLoaderData, useSearch } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { RiGoogleFill, RiLockLine } from "@remixicon/react"
import { authClient } from "@/features/auth/client"
import { getLoginError, getLoginRedirect } from "@/features/auth/policy"
import { APP_ROUTES, PROJECT_NAME } from "@/constants"
import { useOrpc } from "@/lib/use-orpc"
import { BrandMark } from "@/components/shared/BrandMark"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export function LoginPage() {
  const { configured, devMode } = useLoaderData({ from: APP_ROUTES.login })
  const orpc = useOrpc()
  const developmentLogin = useMutation(
    orpc.auth.signInDevelopment.mutationOptions()
  )
  const { redirect, error } = useSearch({ from: APP_ROUTES.login })
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const message = failure ?? getLoginError(error)
  const signIn = async () => {
    setPending(true)
    setFailure(null)
    try {
      if (devMode) {
        await developmentLogin.mutateAsync(undefined)
        window.location.assign(getLoginRedirect(redirect))
        return
      }
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
        errorCallbackURL: `${APP_ROUTES.login}?redirect=${encodeURIComponent(getLoginRedirect(redirect))}`,
      })
      if (result.error) throw new Error("Connexion indisponible")
    } catch {
      setFailure(
        devMode
          ? "La connexion locale a échoué. Vérifiez que la base de données est démarrée."
          : "Impossible de contacter Google. Réessayez dans un instant."
      )
      setPending(false)
    }
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex items-center justify-center gap-3">
          <BrandMark compact />
          <span className="font-medium">{PROJECT_NAME}</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <h1>Votre espace de création</h1>
            </CardTitle>
            <CardDescription>
              Retrouvez vos équipes et vos maquettes avec votre compte
              Digitevent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="min-h-11 w-full"
              disabled={!configured || pending}
              aria-busy={pending}
              onClick={() => void signIn()}
            >
              <RiGoogleFill data-icon="inline-start" />
              {pending
                ? "Connexion en cours…"
                : devMode
                  ? "Entrer avec le compte de dev"
                  : "Continuer avec Google"}
            </Button>
            {!configured && (
              <Alert>
                <AlertDescription>
                  La connexion n’est pas encore disponible. Contactez
                  l’administrateur du studio.
                </AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert variant="destructive">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiLockLine className="size-4 shrink-0" />
              {devMode
                ? "Compte local · dev@digitevent.com"
                : "Réservé aux comptes @digitevent.com"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
