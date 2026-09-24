// postMessage protocol between the studio (parent window) and a frame (see docs/SPEC.md §8.1).
import type { EditorMode } from "./constants"
import type { FrameNode } from "./doc"

export type Rect = { x: number; y: number; width: number; height: number }

export type ShellMessage =
  | { type: "init"; frame: FrameNode; mode: EditorMode }
  | { type: "replace"; frame: FrameNode }
  | { type: "mode"; mode: EditorMode }

export type PointerEventType = "click" | "dblclick" | "mousemove"

export type RendererMessage =
  | { type: "ready" }
  | { type: "rendered"; contentHeight: number; rects: Record<string, Rect> }
  | { type: "pointer"; event: PointerEventType; nodeId: string | null; shift: boolean; meta: boolean; alt: boolean }
  | { type: "error"; nodeId: string; message: string }
