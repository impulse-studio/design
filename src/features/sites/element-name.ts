import type { SourceElement } from "./source"

export const sourceElementName = (element: SourceElement): string =>
  element.kind === "component" || element.isOwnerRoot === false
    ? element.tag
    : (element.owner ?? element.tag)
