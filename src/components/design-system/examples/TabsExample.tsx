import source from "./TabsExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function TabsExample({ options }: ExampleProps) {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-sm">
      <TabsList
        variant={options.variant as ComponentProps<typeof TabsList>["variant"]}
      >
        <TabsTrigger value="overview">Vue d’ensemble</TabsTrigger>
        <TabsTrigger value="activity">Activité</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-5">
        <p className="body-copy text-[13px] leading-[1.55]">Tous les détails du projet, réunis ici.</p>
      </TabsContent>
      <TabsContent value="activity" className="pt-5">
        <p className="body-copy text-[13px] leading-[1.55]">
          La bibliothèque a été mise à jour aujourd’hui.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="pt-5">
        <p className="body-copy text-[13px] leading-[1.55]">Gérez les préférences de votre projet.</p>
      </TabsContent>
    </Tabs>
  )
}
// @example:end

export const getCode = createExampleCode(source)
