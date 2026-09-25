import { useState } from "react"
import { RiCursorLine, RiCodeSLine } from "@remixicon/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "./CodeBlock"
import { ExampleControls } from "./ExampleControls"
import { useExample } from "@/features/design-system/use-example"
import { defaultOptions } from "@/features/design-system/types"
import type { CatalogEntry } from "@/features/design-system/types"

export function ExamplePlayground({ entry }: { entry: CatalogEntry }) {
  const [options, setOptions] = useState(() => defaultOptions(entry))
  const [revision, setRevision] = useState(0)
  const { module, error } = useExample(entry)
  return (
    <Tabs defaultValue="preview" className="gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList variant="line">
          <TabsTrigger value="preview">
            <RiCursorLine />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="code">
            <RiCodeSLine />
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview">
        <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border lg:flex-row">
          <div className="demo-stage min-w-0 [&_>_*]:max-w-full flex min-h-[320px] min-w-0 flex-1 items-center justify-center bg-background px-5 py-10 sm:px-8">
            {error ? (
              <Alert>
                <AlertTitle>Impossible de charger cet aperçu.</AlertTitle>
                <AlertDescription>
                  Rechargez la page pour réessayer.
                </AlertDescription>
              </Alert>
            ) : module ? (
              <module.Component key={revision} options={options} />
            ) : (
              <div className="flex w-full max-w-xs flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            )}
          </div>
          <ExampleControls
            entry={entry}
            options={options}
            onChange={setOptions}
            onReset={() => setRevision(revision + 1)}
          />
        </div>
      </TabsContent>
      <TabsContent value="code">
        {module ? (
          <CodeBlock code={module.getCode(options)} />
        ) : (
          <Skeleton className="h-72 w-full" />
        )}
      </TabsContent>
    </Tabs>
  )
}
