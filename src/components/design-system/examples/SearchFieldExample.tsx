import source from "./SearchFieldExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { SearchField } from "@/components/shared/SearchField"

export function SearchFieldExample() {
  const [query, setQuery] = useState("")
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SearchField
        value={query}
        onValueChange={setQuery}
        placeholder="Rechercher dans les projets…"
      />
      <p className="body-copy text-[13px] leading-[1.55]">
        {query ? `Recherche : ${query}` : "Commencez à saisir un nom."}
      </p>
    </div>
  )
}
// @example:end

export const getCode = createExampleCode(source)
