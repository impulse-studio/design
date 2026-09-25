import source from "./NotFoundExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { Link } from "@tanstack/react-router"
import { NotFoundGlitch } from "@/components/shared/not-found/NotFoundGlitch"
import { buttonVariants } from "@/components/ui/button"

export function NotFoundExample() {
  return (
    <NotFoundGlitch
      actions={
        <Link
          to="/design-system"
          className={buttonVariants({ variant: "outline" })}
        >
          Ouvrir la bibliothèque
        </Link>
      }
    />
  )
}
// @example:end
export const getCode = createExampleCode(source)
