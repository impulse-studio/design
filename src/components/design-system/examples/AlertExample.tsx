import source from "./AlertExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiInformationLine } from "@remixicon/react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function AlertExample({ options }: ExampleProps) {
  return (
    <Alert
      className="w-full max-w-sm"
      variant={options.variant as ComponentProps<typeof Alert>["variant"]}
    >
      <RiInformationLine />
      <AlertTitle>
        {options.variant === "destructive"
          ? "Enregistrement interrompu"
          : "Votre bibliothèque est à jour"}
      </AlertTitle>
      <AlertDescription>
        {options.variant === "destructive"
          ? "Vérifiez votre connexion et réessayez."
          : "Tous les composants utilisent la dernière version du thème."}
      </AlertDescription>
    </Alert>
  )
}
// @example:end

export const getCode = createExampleCode(source)
