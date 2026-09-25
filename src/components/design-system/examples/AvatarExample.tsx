import source from "./AvatarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"

export function AvatarExample({ options }: ExampleProps) {
  return (
    <AvatarGroup>
      <Avatar size={options.size as ComponentProps<typeof Avatar>["size"]}>
        <AvatarFallback>NB</AvatarFallback>
      </Avatar>
      <Avatar size={options.size as ComponentProps<typeof Avatar>["size"]}>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size={options.size as ComponentProps<typeof Avatar>["size"]}>
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  )
}
// @example:end

export const getCode = createExampleCode(source)
