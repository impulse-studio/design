import source from "./ResizableExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export function ResizableExample() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-48 w-full max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize="35%" minSize="20%">
        <div className="flex h-48 items-center justify-center bg-muted">
          <span className="body-copy text-[13px] leading-[1.55]">Navigation</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="65%" minSize="20%">
        <div className="flex h-48 items-center justify-center">
          <span className="body-copy text-[13px] leading-[1.55]">Espace de travail</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
