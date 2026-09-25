import source from "./ToastExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { RiNotification3Line } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function ToastExample({ options }: ExampleProps) {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title:
            options.variant === "error"
              ? "Enregistrement interrompu"
              : "Modifications enregistrées",
          description:
            options.variant === "error"
              ? "Vérifiez votre connexion et réessayez."
              : "Votre projet est à jour.",
          type: options.variant,
        })
      }
    >
      <RiNotification3Line data-icon="inline-start" />
      Afficher une notification
    </Button>
  )
}
// @example:end

export const getCode = createExampleCode(source)
