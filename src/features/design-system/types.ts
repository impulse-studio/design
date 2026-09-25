import type { ComponentType } from "react"

type ExampleState = "default" | "disabled" | "invalid" | "loading"
export type ExampleOptions = {
  variant: string
  size: string
  state: ExampleState
}
export type ExampleProps = { options: ExampleOptions }
export type ExampleModule = {
  Component: ComponentType<ExampleProps>
  getCode: (options: ExampleOptions) => string
}
export type PropertyRow = {
  name: string
  type: string
  defaultValue: string
  description: string
}
export type CatalogDefinition = {
  id: string
  name: string
  description: string
  category: string
  kind: "foundation" | "component" | "composition"
  importPath: string | null
  documentation: string | null
  properties?: PropertyRow[]
  variantProperty?: string | null
  sizeProperty?: string
  variants: string[]
  sizes: string[]
  states: ExampleState[]
  load: () => Promise<ExampleModule>
}
export type CatalogEntry = Omit<
  CatalogDefinition,
  "properties" | "variantProperty" | "sizeProperty"
> & { properties: PropertyRow[] }
export const defaultOptions = (entry: CatalogEntry): ExampleOptions => ({
  variant: entry.variants[0] ?? "default",
  size: entry.sizes[0] ?? "default",
  state: "default",
})
