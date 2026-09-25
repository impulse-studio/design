import source from "./MotionExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiArrowRightLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

export function MotionExample() {
  const [active, setActive] = useState(false)
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex h-20 items-center rounded-lg border bg-muted p-4">
        <div
          className="size-9 rounded-md bg-primary transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{ transform: active ? "translateX(150px)" : "translateX(0)" }}
        />
      </div>
      <Button variant="outline" onClick={() => setActive(!active)}>
        Tester la transition
        <RiArrowRightLine data-icon="inline-end" />
      </Button>
      <p className="body-copy text-[13px] leading-[1.55]">
        150 ms · ease-out · transform. La préférence de réduction des animations
        est respectée.
      </p>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
