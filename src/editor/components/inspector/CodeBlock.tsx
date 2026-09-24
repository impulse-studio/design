import { RiFileCopyLine } from "@remixicon/react"

import { IconButton } from "@/components/studio"

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative rounded-md bg-muted">
      <pre className="overflow-x-auto p-2 pr-8 font-mono text-[11px] leading-relaxed">{code}</pre>
      <IconButton
        icon={RiFileCopyLine}
        label="Copier"
        size="xs"
        className="absolute top-1 right-1"
        onClick={() => void navigator.clipboard.writeText(code)}
      />
    </div>
  )
}
