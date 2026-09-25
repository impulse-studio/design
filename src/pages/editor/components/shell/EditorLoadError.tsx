import { Link, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { APP_ROUTES } from "@/constants"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"

export function EditorLoadError() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Impossible d’ouvrir la maquette</EmptyTitle>
          <EmptyDescription>
            Vérifiez que PostgreSQL est disponible et que cette maquette existe.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => void router.invalidate()}>Réessayer</Button>
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link to={APP_ROUTES.studio} />}
          >
            Retour au studio
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
