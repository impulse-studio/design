import type { FrameNode, MockupDoc, FramePreset } from "@digit-ai-studio/shared"
import { FRAME_PRESETS } from "@digit-ai-studio/shared"
import { library, newId } from "./library"

export const makeFrame = (
  preset: FramePreset = "desktop",
  x = 0,
  y = 0
): FrameNode => ({
  id: newId(),
  type: "frame",
  name: FRAME_PRESETS[preset].label,
  preset,
  x,
  y,
  width: FRAME_PRESETS[preset].width,
  height: FRAME_PRESETS[preset].height,
  theme: "light",
  clip: true,
  style: { background: "#ffffff" },
  children: [],
})
export const emptyDocument = (): MockupDoc => ({
  schemaVersion: 1,
  libVersion: library.orchestrationSha,
  pages: [
    {
      id: newId(),
      name: "Page 1",
      background: "#f5f5f5",
      frames: [makeFrame()],
    },
  ],
})
export const framesOf = (doc: MockupDoc) => doc.pages[0].frames
