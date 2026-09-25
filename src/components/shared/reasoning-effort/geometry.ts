export type ReasoningEffortOption = { value: string; label: string }

export interface ReasoningEffortProps {
  value?: string
  defaultValue?: string
  options?: readonly ReasoningEffortOption[]
  onValueChange?: (value: string) => void
  modelLabel?: string
  disabled?: boolean
}

export const DEFAULT_OPTIONS: readonly ReasoningEffortOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "xhigh", label: "Extra High" },
]

export const TRACK = 224

export const HEIGHT = 32

export const RADIUS = HEIGHT / 2

export const BUMP_H = 20

export const REST_W = 27.2

export const DRAG_W = 33.6

export const REST_H = 27.2

export const EDGE_PAD = (HEIGHT - REST_H) / 2

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function centerFor(value: number, count: number) {
  const span = TRACK - RADIUS * 2
  return RADIUS + (value / (Math.max(2, count) - 1)) * span
}

export function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

const LEFT_SHOULDER = 23.572

/** Space from each glyph edge to the foot of the label shoulder. */
const TEXT_SIDE = 20

/** How far the outer foot walks down the cap once it passes the crown. */
const PHI_MAX = 0.6

const PHI_REACH = 36

export function plateauFor(textW: number) {
  return Math.max(8, textW + TEXT_SIDE * 2 - LEFT_SHOULDER * 2)
}

function smoothstep(t: number) {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

function capFoot(side: -1 | 1, phi: number) {
  const crown = side === -1 ? RADIUS : TRACK - RADIUS
  return {
    x: crown + side * RADIUS * Math.sin(phi),
    y: BUMP_H + RADIUS * (1 - Math.cos(phi)),
  }
}

export function shellGeom(cx: number, plateauW: number) {
  const crownL = RADIUS
  const crownR = TRACK - RADIUS
  let topL = cx - plateauW / 2
  let topR = topL + plateauW
  let phiL = 0
  let phiR = 0

  const overflowL = crownL - (topL - LEFT_SHOULDER)
  if (overflowL > 0) {
    phiL = PHI_MAX * smoothstep(overflowL / PHI_REACH)
    const foot = capFoot(-1, phiL)
    const minTopL = foot.x + LEFT_SHOULDER * Math.cos(phiL)
    if (topL < minTopL) {
      topR += minTopL - topL
      topL = minTopL
    }
  }

  const overflowR = topR + LEFT_SHOULDER - crownR
  if (overflowR > 0) {
    phiR = PHI_MAX * smoothstep(overflowR / PHI_REACH)
    const foot = capFoot(1, phiR)
    const maxTopR = foot.x - LEFT_SHOULDER * Math.cos(phiR)
    if (topR > maxTopR) {
      topL -= topR - maxTopR
      topR = maxTopR
    }
  }

  // The tilted shoulder is shorter in x, which would pull the text onto the
  // outer edge. Grow the plateau inward by that loss and keep the label with it.
  const insetL = phiL > 0 ? LEFT_SHOULDER * (1 - Math.cos(phiL)) : 0
  const insetR = phiR > 0 ? LEFT_SHOULDER * (1 - Math.cos(phiR)) : 0
  topR += insetL
  topL -= insetR

  return { topL, topR, phiL, phiR, insetL, insetR }
}

/** Reference shoulder. phi tilts the foot onto the cap tangent; 0 is the flat scoop. */
function shoulderCmds(
  footX: number,
  footY: number,
  platX: number,
  platY: number,
  phi: number,
  dir: 1 | -1
) {
  const xScale = Math.abs(platX - footX) / LEFT_SHOULDER
  const yScale = Math.max(0.001, (footY - platY) / 20)
  const tangent = { x: dir * Math.cos(phi), y: -Math.sin(phi) }
  const map = (lx: number, ly: number) => ({
    x: footX + dir * lx * xScale,
    y: footY + (ly - 20) * yScale,
  })
  const h1 = 5.398 * xScale
  const p0 = { x: footX, y: footY }
  const c1 = { x: footX + tangent.x * h1, y: footY + tangent.y * h1 }
  const c2 = map(10.012, 16.114)
  const p1 = map(10.93, 10.794)
  const c3 = map(11.916, 4.577)
  const c4 = map(17.277, 0)
  const p3 = { x: platX, y: platY }
  const fmt = (p: { x: number; y: number }) =>
    `${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  if (dir === 1)
    return `C${fmt(c1)} ${fmt(c2)} ${fmt(p1)}C${fmt(c3)} ${fmt(c4)} ${fmt(p3)}`
  return `C${fmt(c4)} ${fmt(c3)} ${fmt(p1)}C${fmt(c2)} ${fmt(c1)} ${fmt(p0)}`
}

/** One outline: the pill, with the label shoulder grown out of its top edge. */
export function shellPath(cx: number, open: number, plateauW: number) {
  const trackTop = BUMP_H
  const trackBot = BUMP_H + HEIGHT
  const crownL = RADIUS
  const crownR = TRACK - RADIUS
  if (open < 0.012) {
    return `M${crownL} ${trackTop}H${crownR}A${RADIUS} ${RADIUS} 0 0 1 ${crownR} ${trackBot}H${crownL}A${RADIUS} ${RADIUS} 0 0 1 ${crownL} ${trackTop}Z`
  }

  const bumpTop = BUMP_H * (1 - open)
  const { topL, topR, phiL, phiR } = shellGeom(cx, plateauW)
  const cmds = [`M${crownL} ${trackBot}`]

  if (phiL > 0.001) {
    const foot = capFoot(-1, phiL)
    cmds.push(
      `A${RADIUS} ${RADIUS} 0 0 1 ${foot.x.toFixed(2)} ${foot.y.toFixed(2)}`
    )
    cmds.push(shoulderCmds(foot.x, foot.y, topL, bumpTop, phiL, 1))
  } else {
    cmds.push(`A${RADIUS} ${RADIUS} 0 0 1 ${crownL} ${trackTop}`)
    const footL = topL - LEFT_SHOULDER
    if (footL > crownL + 0.4) cmds.push(`H${footL.toFixed(2)}`)
    cmds.push(shoulderCmds(footL, trackTop, topL, bumpTop, 0, 1))
  }

  if (topR > topL + 0.4) cmds.push(`H${topR.toFixed(2)}`)

  if (phiR > 0.001) {
    const foot = capFoot(1, phiR)
    cmds.push(shoulderCmds(foot.x, foot.y, topR, bumpTop, phiR, -1))
    cmds.push(`A${RADIUS} ${RADIUS} 0 0 1 ${crownR} ${trackBot}`)
  } else {
    const footR = topR + LEFT_SHOULDER
    cmds.push(shoulderCmds(footR, trackTop, topR, bumpTop, 0, -1))
    if (footR < crownR - 0.4) cmds.push(`H${crownR}`)
    cmds.push(`A${RADIUS} ${RADIUS} 0 0 1 ${crownR} ${trackBot}`)
  }

  cmds.push(`H${crownL}Z`)
  return cmds.join("")
}
