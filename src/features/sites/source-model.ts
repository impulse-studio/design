export type SourceElement = {
  id: string
  file: string
  tag: string
  text: string | null
  owner: string | null
  isOwnerRoot?: boolean
  kind: "html" | "component"
  line: number | null
  signature: string
}
export type ParsedSource = {
  elements: SourceElement[]
  normalize: (claim: (previous: string | null) => string) => string
  editText: (id: string, text: string) => string
}
export const sourceHash = (text: string) => {
  let value = 2166136261
  for (const char of text)
    value = Math.imul(value ^ char.charCodeAt(0), 16777619)
  return (value >>> 0).toString(36)
}
