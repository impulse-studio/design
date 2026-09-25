import source from "./ItemExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import { useState } from "react"
import type { ComponentProps } from "react"
import {
  RiBookmarkFill,
  RiBookmarkLine,
  RiFileTextLine,
} from "@remixicon/react"
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item"
import { Button } from "@/components/ui/button"

export function ItemExample({ options }: ExampleProps) {
  const [saved, setSaved] = useState(false)
  return (
    <Item
      className="w-full max-w-sm"
      variant={options.variant as ComponentProps<typeof Item>["variant"]}
    >
      <ItemMedia variant="icon">
        <RiFileTextLine />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Fondations de l’interface</ItemTitle>
        <ItemDescription>
          Mis à jour aujourd’hui · 12 composants
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => setSaved(!saved)}
        >
          {saved ? <RiBookmarkFill /> : <RiBookmarkLine />}
        </Button>
      </ItemActions>
    </Item>
  )
}
// @example:end

export const getCode = createExampleCode(source)
