import source from "./InputGroupExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiCloseLine, RiSearchLine } from "@remixicon/react"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"

export function InputGroupExample() {
  const [value, setValue] = useState("")
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroupAddon>
        <RiSearchLine />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Rechercher des projets"
        placeholder="Rechercher un projet…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Effacer" onClick={() => setValue("")}>
            <RiCloseLine />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
