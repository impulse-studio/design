import source from "./EmptyExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiAddLine, RiFolderAddLine } from "@remixicon/react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

export function EmptyExample() {
  const [created, setCreated] = useState(false)
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiFolderAddLine />
        </EmptyMedia>
        <EmptyTitle>
          {created ? "Votre premier projet" : "Un espace pour vos idées"}
        </EmptyTitle>
        <EmptyDescription>
          {created
            ? "Vous pouvez commencer à composer votre interface."
            : "Commencez par créer votre premier projet."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setCreated(!created)}>
          <RiAddLine data-icon="inline-start" />
          {created ? "Réinitialiser la démo" : "Créer un projet"}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
// @example:end

export const getCode = createExampleCode(source)
