import source from "./AttachmentExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"
import type { ExampleProps } from "@/features/design-system/types"

// @example:start
import type { ComponentProps } from "react"
import { RiFileTextLine } from "@remixicon/react"
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
} from "@/components/ui/attachment"

export function AttachmentExample({ options }: ExampleProps) {
  return (
    <Attachment
      className="w-full max-w-xs"
      state={options.variant as ComponentProps<typeof Attachment>["state"]}
    >
      <AttachmentMedia>
        <RiFileTextLine />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Guide de la bibliothèque.pdf</AttachmentTitle>
        <AttachmentDescription>
          {options.variant === "error"
            ? "Échec de l’import"
            : options.variant === "uploading"
              ? "Import en cours…"
              : "Document PDF · 2,4 Mo"}
        </AttachmentDescription>
      </AttachmentContent>
    </Attachment>
  )
}
// @example:end

export const getCode = createExampleCode(source)
