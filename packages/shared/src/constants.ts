// Values shared by the studio (React) and the renderer (Vue).

export const MESSAGE_SOURCE = {
  studio: "digit-studio",
  renderer: "digit-renderer",
} as const

export const RENDERER_PATH = "/renderer/"

export const FRAME_PRESETS = {
  desktop: { label: "Desktop", width: 1440, height: 900 },
  laptop: { label: "Laptop", width: 1280, height: 800 },
  tablet: { label: "Tablet", width: 768, height: 1024 },
  mobile: { label: "Mobile", width: 390, height: 844 },
} as const

export type FramePreset = keyof typeof FRAME_PRESETS

export const FRAME_GAP = 80

// Token values as compiled in digicomponents/dist/style.css (1rem = 16px). Synced by hand until the manifest (M1) generates them.
export const SPACING_TOKENS = {
  "spacing-sm": 8,
  "spacing-md": 16,
  "spacing-lg": 20,
  "spacing-xl": 28,
} as const

export const RADIUS_TOKENS = {
  "radius-xs": 2,
  "radius-sm": 4,
  "radius-md": 6,
  "radius-lg": 8,
  "radius-xl": 12,
} as const

export const FONT_SIZE_TOKENS = [
  "font-size-xs",
  "font-size-sm",
  "font-size-md",
  "font-size-lg",
  "font-size-xl",
  "font-size-2xl",
  "font-size-3xl",
] as const

export const COLOR_TOKENS = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "card",
  "border",
  "primary",
  "primary-foreground",
  "secondary",
  "success",
  "destructive",
  "off-white",
  "off-black",
] as const

export const FONT_WEIGHTS = [400, 500, 600, 700] as const

export type EditorMode = "edit" | "preview"

// Context providers render their slots without a DOM root to carry layout styles.
export const LAYOUT_WRAPPER_COMPONENTS: ReadonlySet<string> = new Set([
  "DigiPopover",
  "DigiDropdownMenu",
])
