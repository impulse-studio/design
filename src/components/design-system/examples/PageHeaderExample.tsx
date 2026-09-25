import source from "./PageHeaderExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { RiAddLine } from "@remixicon/react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export function PageHeaderExample() {
  return (
    <div className="w-full">
      <PageHeader
        title="Mes projets"
        description="Un espace pour les idées qui prennent forme."
        eyebrow="Espace de travail"
        actions={
          <Button
            onClick={() =>
              toast.add({
                title: "Créer un projet",
                description: "Action de démonstration.",
              })
            }
          >
            <RiAddLine data-icon="inline-start" />
            Nouveau projet
          </Button>
        }
      />
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
