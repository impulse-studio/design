// Mockup document model (see docs/SPEC.md §7).
import type { FramePreset } from "./constants"

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export type TokenRef = { token: string }
export type Length = TokenRef | number

export type SizeMode = { mode: "fixed" | "hug" | "fill"; value?: number }

export type SelfLayout = {
  width?: SizeMode
  height?: SizeMode
  minW?: number
  maxW?: number
  alignSelf?: "start" | "center" | "end" | "stretch"
}

export type AutoLayout = {
  direction: "column" | "row"
  wrap?: boolean
  gap?: Length | "auto"
  padding?: [Length, Length, Length, Length]
  justify?: "start" | "center" | "end" | "between"
  align?: "start" | "center" | "end" | "stretch"
}

export type BoxStyle = {
  background?: TokenRef
  border?: { color: TokenRef; width: number }
  radius?: TokenRef
}

type Base = {
  id: string
  name?: string
  hidden?: boolean
  locked?: boolean
  layout?: SelfLayout
}

export type ComponentNode = Base & {
  type: "component"
  component: string
  props?: Record<string, Json>
  slots?: Record<string, Node[]>
  text?: string
}

export type TemplateNode = Base & {
  type: "template"
  template: string
  props?: Record<string, Json>
  slots?: Record<string, Node[]>
}

export type BoxNode = Base & {
  type: "box"
  autoLayout: AutoLayout
  style?: BoxStyle
  children: Node[]
}

export type TextNode = Base & {
  type: "text"
  content: string
  textStyle?: TokenRef
  color?: TokenRef
  weight?: 400 | 500 | 600 | 700
}

export type ImageNode = Base & {
  type: "image"
  src: string
  fit?: "cover" | "contain"
  radius?: TokenRef
}

export type Node = ComponentNode | TemplateNode | BoxNode | TextNode | ImageNode

export type MockupDoc = {
  schemaVersion: 1
  libVersion: string
  frames: FrameNode[]
}

export type FrameNode = {
  id: string
  type: "frame"
  name: string
  x: number
  y: number
  width: number
  height: number | "hug"
  preset?: FramePreset
  theme?: "light" | "dark"
  children: Node[]
}
