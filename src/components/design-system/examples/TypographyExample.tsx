import source from "./TypographyExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start

export function TypographyExample() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em] mb-3">Inter Display · 24 / 32 · 600</p>
        <h2 className="page-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_20] text-[22px] leading-[30px] font-semibold tracking-[-0.022em]">La clarté, dans chaque détail.</h2>
      </div>
      <div>
        <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em] mb-2">Inter Display · 16 / 24 · 600</p>
        <h3 className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em]">Un langage commun</h3>
      </div>
      <div>
        <p className="eyebrow text-[12px] leading-[20px] font-normal tracking-[-0.006em] mb-2">Inter · 13 / 20 · 400</p>
        <p className="body-copy text-[13px] leading-[1.55]">
          Une interface se comprend par sa hiérarchie, ses alignements et son
          rythme. Chaque niveau de texte a un rôle.
        </p>
      </div>
      <p className="mono-label font-mono text-[11px]">
        Inter · texte optique 14 / titres optiques 32
      </p>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
