import {
  RiFileTextLine as FileText,
  RiEditLine as PencilLine,
  RiTerminalBoxLine as SquareTerminal,
  RiToolsLine as Wrench,
} from "@remixicon/react"

export function ActionIcon({ action }: { action: string }) {
  if (action === "read") return <FileText className="size-4" />
  if (action === "edit" || action === "write") {
    return <PencilLine className="size-4" />
  }
  if (action === "run") return <SquareTerminal className="size-4" />
  return <Wrench className="size-4" />
}
