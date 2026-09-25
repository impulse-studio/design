// Mockup document model (see docs/SPEC.md §7).
import type { FramePreset } from "./constants"

export type Json =
  string | number | boolean | null | Json[] | { [key: string]: Json }

export type TokenRef = { token: string }
export type Length = TokenRef | number
export type Color = (TokenRef & { alpha?: number }) | string

export type SizeMode = { mode: "fixed" | "hug" | "fill"; value?: number }

export type SelfLayout = {
  width?: SizeMode
  height?: SizeMode
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  position?: "flow" | { x: number; y: number }
  alignSelf?: "start" | "center" | "end" | "stretch"
}

export type AutoLayout = {
  direction: "column" | "row" | "grid"
  wrap?: boolean
  gap?: Length | "auto"
  crossGap?: Length
  gridColumns?: number
  padding?: [Length, Length, Length, Length]
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  align?: "start" | "center" | "end" | "stretch"
}

export type BoxStyle = {
  background?: Color
  backgroundVisible?: boolean
  border?: { color: Color; width: number; visible?: boolean }
  radius?: Length
  shadow?: TokenRef | string
  opacity?: number
}

type Base = {
  id: string
  name?: string
  hidden?: boolean
  locked?: boolean
  lockAspectRatio?: boolean
  layout?: SelfLayout
  style?: BoxStyle
}

export type ComponentNode = Base & {
  type: "component"
  component: string
  props?: Record<string, Json>
  slots?: Record<string, Node[]>
  text?: string
  localVariant?: LocalComponentVariant
}

/** A mockup-local component variant shared by every instance carrying its id. */
export type LocalComponentVariant = {
  id: string
  name: string
  props: Record<string, Json>
  text?: string
  layout?: SelfLayout
  style?: BoxStyle
}

export type TemplateNode = Base & {
  type: "template"
  template: string
  props?: Record<string, Json>
  slots?: Record<string, Node[]>
}

export type BoxNode = Base & {
  type: "box"
  autoLayout?: AutoLayout
  clip?: boolean
  style?: BoxStyle
  children: Node[]
}

export type TextNode = Base & {
  type: "text"
  content: string
  textStyle?: TokenRef
  color?: Color
  weight?: 400 | 500 | 600 | 700
  fontSize?: Length
  textAlign?: "left" | "center" | "right" | "justify"
  lineHeight?: number
}

export type ImageNode = Base & {
  type: "image"
  src: string
  fit?: "cover" | "contain"
  radius?: Length
}

/** Native DOM structure captured when a linked Digit component is detached. */
export type ElementNode = Base & {
  type: "element"
  tag: string
  className?: string
  attributes?: Record<string, string | number | boolean>
  inlineStyle?: string
  children: Node[]
}

export type Node =
  | ComponentNode
  | TemplateNode
  | BoxNode
  | TextNode
  | ImageNode
  | ElementNode

export type MockupDoc = {
  schemaVersion: 1
  libVersion: string
  pages: { id: string; name: string; background: string; frames: FrameNode[] }[]
}

export type FrameNode = {
  id: string
  type: "frame"
  name: string
  x: number
  y: number
  width: number | "hug"
  height: number | "hug"
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  autoLayout?: AutoLayout
  preset?: FramePreset
  theme?: "light" | "dark"
  hidden?: boolean
  locked?: boolean
  lockAspectRatio?: boolean
  style?: BoxStyle
  clip?: boolean
  children: Node[]
}
