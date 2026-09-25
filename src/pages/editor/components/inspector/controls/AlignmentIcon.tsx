import type { Alignment } from "@/features/editor/arrange"

export function AlignmentIcon({ alignment }: { alignment: Alignment }) {
  const vertical =
    alignment === "top" || alignment === "middle" || alignment === "bottom"
  const mode =
    alignment === "left" || alignment === "top"
      ? "start"
      : alignment === "right" || alignment === "bottom"
        ? "end"
        : "center"
  const guide = mode === "start" ? 4 : mode === "end" ? 20 : 12
  const first = mode === "start" ? 7 : mode === "end" ? 5 : 6
  const second = mode === "start" ? 7 : mode === "end" ? 9 : 8
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={`M${guide} 3v18`} />
        <rect
          x={first}
          y="6"
          width="12"
          height="4"
          rx=".5"
          fill="currentColor"
          stroke="none"
        />
        <rect
          x={second}
          y="14"
          width="8"
          height="4"
          rx=".5"
          fill="currentColor"
          stroke="none"
        />
      </g>
    </svg>
  )
}
