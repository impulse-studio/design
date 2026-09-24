export const LEFT_PANEL_WIDTH = 280
export const RIGHT_PANEL_WIDTH = 300

export const ZOOM = {
  min: 0.05,
  max: 4,
  /** Zoom factor per wheel delta unit: factor = exp(-deltaY × sensitivity). */
  wheelSensitivity: 0.004,
  /** Padding kept around content when fitting it to the viewport. */
  fitPadding: 80,
} as const

export const HISTORY_LIMIT = 100

export const CANVAS_BACKGROUND = "#F5F5F5"
export const SELECTION_COLOR = "#0D99FF"

export type Tool = "move" | "hand"

export const TOOLS: { id: Tool; label: string; shortcut: string }[] = [
  { id: "move", label: "Déplacer", shortcut: "V" },
  { id: "hand", label: "Main", shortcut: "H" },
]

export const NODE_TYPE_LABELS = {
  frame: "Frame",
  component: "Composant Digi",
  template: "Template backoffice",
  box: "Auto layout",
  text: "Texte",
  image: "Image",
} as const
