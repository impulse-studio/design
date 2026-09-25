import source from "./InlineCitationsExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { InlineCitations } from "@/components/shared/InlineCitations"

export function InlineCitationsExample() {
  return (
    <div className="w-full max-w-lg">
      <InlineCitations
        text="Les composants shadcn sont personnalisables[1]. Les primitives Base UI gèrent les interactions et l’accessibilité[2]."
        refs={[
          {
            n: 1,
            label: "shadcn/ui",
            host: "ui.shadcn.com",
            url: "https://ui.shadcn.com",
          },
          {
            n: 2,
            label: "Base UI",
            host: "base-ui.com",
            url: "https://base-ui.com",
          },
        ]}
      />
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
