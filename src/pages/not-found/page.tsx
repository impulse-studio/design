import { Link } from "@tanstack/react-router"
import { buttonVariants } from "@/components/ui/button"
import { NotFoundGlitch } from "@/components/shared/not-found/NotFoundGlitch"
import { APP_ROUTES } from "@/constants"

export function NotFoundPage() {
  return (
    <NotFoundGlitch
      className="min-h-[70svh]"
      actions={
        <Link
          to={APP_ROUTES.designSystem}
          className={buttonVariants({ variant: "outline" })}
        >
          Ouvrir la bibliothèque
        </Link>
      }
    />
  )
}
