import source from "./ProgressExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function ProgressExample() {
  const [value, setValue] = useState(40)
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex justify-between">
        <span>Préparation de la bibliothèque</span>
        <span className="mono-label font-mono text-[11px]">{value} %</span>
      </div>
      <Progress value={value} aria-label="Progression" />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setValue(value >= 100 ? 0 : Math.min(100, value + 20))}
      >
        {value >= 100 ? "Recommencer" : "Avancer"}
      </Button>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
