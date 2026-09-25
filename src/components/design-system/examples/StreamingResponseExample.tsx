import source from "./StreamingResponseExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useEffect, useState } from "react"
import { StreamingResponse } from "@/components/shared/streaming/StreamingResponse"
import { Button } from "@/components/ui/button"

const response =
  "Votre page d’inscription est prête. Elle comprend un formulaire accessible, une confirmation par e-mail et une liste d’attente. Les composants utilisent les styles du projet et s’adaptent aux écrans mobiles."

export function StreamingResponseExample() {
  const [length, setLength] = useState(0)
  const [running, setRunning] = useState(true)
  const streaming = running && length < response.length
  useEffect(() => {
    if (!streaming) return
    const timer = window.setInterval(
      () => setLength((value) => Math.min(value + 4, response.length)),
      45
    )
    return () => window.clearInterval(timer)
  }, [streaming])
  const restart = () => {
    setLength(0)
    setRunning(true)
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <StreamingResponse
        status={streaming ? "streaming" : "complete"}
        copyText={response.slice(0, length)}
        onRetry={restart}
        sources={[
          {
            id: "shadcn",
            title: "shadcn/ui",
            domain: "ui.shadcn.com",
            url: "https://ui.shadcn.com",
          },
          {
            id: "base",
            title: "Base UI",
            domain: "base-ui.com",
            url: "https://base-ui.com",
          },
        ]}
        contentClassName="min-h-28"
      >
        <p>{response.slice(0, length) || "…"}</p>
      </StreamingResponse>
      {streaming && (
        <Button
          className="self-end"
          variant="ghost"
          size="sm"
          onClick={() => setRunning(false)}
        >
          Arrêter
        </Button>
      )}
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
