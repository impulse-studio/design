import source from "./ImageGenerationExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useEffect, useState } from "react"
import { ImageGeneration } from "@/components/shared/image-generation/ImageGeneration"
import type { ImageGenerationStatus } from "@/components/shared/image-generation/types"
import { Button } from "@/components/ui/button"

export function ImageGenerationExample() {
  const [status, setStatus] = useState<ImageGenerationStatus>("queued")
  useEffect(() => {
    const next = {
      queued: "generating",
      generating: "refining",
      refining: "complete",
    } as const
    if (status === "complete" || status === "error") return
    const timer = window.setTimeout(
      () => setStatus(next[status]),
      status === "queued" ? 800 : 1800
    )
    return () => window.clearTimeout(timer)
  }, [status])
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <ImageGeneration
        status={status}
        prompt="Un lac alpin au lever du soleil"
        label="Illustration de démonstration : lac et montagnes"
        onRetry={() => setStatus("queued")}
      >
        <img
          src="/examples/generated-landscape.svg"
          alt="Lac alpin entouré de montagnes au lever du soleil"
        />
      </ImageGeneration>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setStatus("queued")}>
          Relancer
        </Button>
        <Button variant="outline" size="sm" onClick={() => setStatus("error")}>
          Simuler une erreur
        </Button>
      </div>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
