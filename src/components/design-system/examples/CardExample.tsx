import source from "./CardExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import type { ComponentProps } from "react"
import { RiBookmarkLine } from "@remixicon/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function CardExample({ options }: ExampleProps) {
  const [saved, setSaved] = useState(false)
  return (
    <Card
      className="w-full max-w-sm"
      size={options.size as ComponentProps<typeof Card>["size"]}
    >
      <CardHeader>
        <CardTitle>Identité du projet</CardTitle>
        <CardDescription>
          Un espace commun pour les prochaines idées.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="body-copy text-[13px] leading-[1.55]">Bibliothèque partagée</span>
          <Badge variant="secondary">À jour</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setSaved(!saved)}>
          <RiBookmarkLine data-icon="inline-start" />
          {saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  )
}
// @example:end

export const getCode = createExampleCode(source)
