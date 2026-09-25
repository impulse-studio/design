import type { ComponentType } from "react"

export type ExampleState = "default" | "disabled" | "invalid" | "loading"
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
export type CatalogEntry = {
  id: string
  name: string
  description: string
  category: string
  kind: "foundation" | "component" | "composition"
  variants: string[]
  sizes: string[]
  states: ExampleState[]
  load: () => Promise<ExampleModule>
}
export const defaultOptions = (entry: CatalogEntry): ExampleOptions => ({
  variant: entry.variants[0] ?? "default",
  size: entry.sizes[0] ?? "default",
  state: "default",
})
