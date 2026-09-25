import source from "./PromptInputExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import { PromptInput } from "@/components/shared/PromptInput"
import { toast } from "@/components/ui/toast"

export function PromptInputExample({ options }: ExampleProps) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  return (
    <div className="w-full max-w-xl">
      <PromptInput
        value={value}
        onValueChange={setValue}
        disabled={options.state === "disabled"}
        loading={loading}
        models={[
          { value: "standard", label: "Standard" },
          { value: "reasoning", label: "Raisonnement" },
        ]}
        actions={[{ value: "example", label: "Insérer un exemple" }]}
        onAction={() =>
          setValue("Crée une page d’inscription pour un événement.")
        }
        onSubmit={() => {
          setLoading(true)
          toast.add({ title: "Simulation démarrée", type: "info" })
        }}
        onStop={() => setLoading(false)}
      />
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
