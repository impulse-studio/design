"use client"
// Installed from https://www.aicss.dev/r/reasoning-effort.json.
// Original SVG geometry, styling and drag motion retained; controlled props added for the chat.

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import s from "./ReasoningEffort.module.css"
import { useReducedMotion } from "motion/react"
import {
  DEFAULT_OPTIONS,
  TRACK,
  HEIGHT,
  RADIUS,
  BUMP_H,
  REST_W,
  DRAG_W,
  REST_H,
  EDGE_PAD,
  clamp,
  centerFor,
  easeOut,
  plateauFor,
  shellGeom,
  shellPath,
} from "./geometry"
import type { ReasoningEffortProps } from "./geometry"

export function ReasoningEffort({
  value,
  defaultValue = "medium",
  options = DEFAULT_OPTIONS,
  onValueChange,
  modelLabel = "4.7",
  disabled = false,
}: ReasoningEffortProps = {}) {
  const STOPS = options.map((option) => option.label)
  const initialIndex = Math.max(
    0,
    options.findIndex((option) => option.value === (value ?? defaultValue))
  )
  const reduce = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(initialIndex)
  const displayRef = useRef(initialIndex)
  const openRef = useRef(0)
  const draggingRef = useRef(false)
  const [display, setDisplay] = useState(initialIndex)
  const [open, setOpen] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [textW, setTextW] = useState(64)
  const plateauTarget = plateauFor(textW)
  const plateauRef = useRef(plateauTarget)
  const [plateauW, setPlateauW] = useState(plateauTarget)
  const revealRef = useRef(0)
  const [reveal, setReveal] = useState(0)
  const gradId = useId().replace(/:/g, "")

  useLayoutEffect(() => {
    if (value === undefined || draggingRef.current) return
    valueRef.current = initialIndex
    displayRef.current = initialIndex
    setDisplay(initialIndex)
  }, [value, initialIndex])

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const read = () => {
      const marked = el.parentElement?.closest("[data-theme]")
      if (marked) {
        setTheme(
          marked.getAttribute("data-theme") === "dark" ? "dark" : "light"
        )
        return
      }
      if (el.closest(".dark")) {
        setTheme("dark")
        return
      }
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      )
    }
    read()
    const marked = el.parentElement?.closest("[data-theme]")
    const obs = new MutationObserver(read)
    if (marked)
      obs.observe(marked, { attributes: true, attributeFilter: ["data-theme"] })
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", read)
    return () => {
      obs.disconnect()
      media.removeEventListener("change", read)
    }
  }, [])

  useEffect(() => {
    const toOpen = dragging ? 1 : 0
    const fromOpen = openRef.current
    const fromValue = displayRef.current
    const targetValue = dragging ? fromValue : Math.round(valueRef.current)
    if (reduce) {
      openRef.current = toOpen
      setOpen(toOpen)
      if (!dragging) {
        valueRef.current = targetValue
        displayRef.current = targetValue
        setDisplay(targetValue)
      }
      return
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 220)
      const e = easeOut(t)
      const nextOpen = fromOpen + (toOpen - fromOpen) * e
      openRef.current = nextOpen
      setOpen(nextOpen)
      if (!dragging) {
        const nextValue = fromValue + (targetValue - fromValue) * e
        displayRef.current = nextValue
        setDisplay(nextValue)
        if (t === 1) {
          valueRef.current = targetValue
          displayRef.current = targetValue
        }
      }
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [dragging, reduce])

  useEffect(() => {
    const from = plateauRef.current
    const to = plateauTarget
    if (reduce || Math.abs(to - from) < 0.3) {
      plateauRef.current = to
      setPlateauW(to)
      return
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 90)
      const next = from + (to - from) * easeOut(t)
      plateauRef.current = next
      setPlateauW(next)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [plateauTarget, reduce])

  useEffect(() => {
    const to = dragging ? 1 : 0
    const from = revealRef.current
    if (reduce) {
      revealRef.current = to
      setReveal(to)
      return
    }
    const delay = dragging ? 85 : 0
    const dur = dragging ? 132 : 90
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const elapsed = now - start - delay
      if (elapsed < 0) {
        raf = requestAnimationFrame(step)
        return
      }
      const t = Math.min(1, elapsed / dur)
      const next = from + (to - from) * easeOut(t)
      revealRef.current = next
      setReveal(next)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [dragging, reduce])

  function commit(next: number) {
    const previous = Math.round(valueRef.current)
    valueRef.current = next
    displayRef.current = next
    setDisplay(next)
    const option = options.at(Math.round(next))
    if (option && previous !== Math.round(next)) onValueChange?.(option.value)
  }

  function valueFrom(clientX: number) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return valueRef.current
    const t = (clientX - rect.left - RADIUS) / (rect.width - RADIUS * 2)
    return clamp(t * (STOPS.length - 1), 0, STOPS.length - 1)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || options.length < 2 || event.button !== 0) return
    event.currentTarget.focus({ preventScroll: true })
    draggingRef.current = true
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* Pointer capture needs a trusted event. */
    }
    setDragging(true)
    commit(valueFrom(event.clientX))
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || !draggingRef.current) return
    commit(valueFrom(event.clientX))
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return
    draggingRef.current = false
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      /* Ignore when the event was not trusted. */
    }
    setDragging(false)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled || options.length < 2) return
    const max = STOPS.length - 1
    const current = Math.round(valueRef.current)
    let next = current
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = Math.min(max, current + 1)
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = Math.max(0, current - 1)
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = max
    else return
    event.preventDefault()
    commit(next)
  }

  const center = centerFor(display, STOPS.length)
  const thumbW = REST_W + (DRAG_W - REST_W) * open
  const thumbH = REST_H
  const outerPad = EDGE_PAD
  let thumbLeft = center - thumbW / 2
  let thumbRight = thumbLeft + thumbW
  if (thumbLeft < outerPad) {
    thumbLeft = outerPad
    thumbRight = thumbLeft + thumbW
  }
  if (thumbRight > TRACK - outerPad) {
    thumbRight = TRACK - outerPad
    thumbLeft = thumbRight - thumbW
  }
  const fillW = Math.min(TRACK, thumbRight + EDGE_PAD)
  const active = Math.round(display)
  const level = STOPS[active]
  const tickHeights = [4.8, 6.4, 8, 9.6]
  const plateau = shellGeom(center, plateauW)
  const labelX =
    (plateau.topL + plateau.topR) / 2 + (plateau.insetL - plateau.insetR) / 2

  useLayoutEffect(() => {
    const w = labelRef.current?.getBoundingClientRect().width ?? 0
    if (w > 0 && Math.abs(w - textW) > 0.4) setTextW(w)
  }, [level, theme, textW])

  return (
    <div
      ref={rootRef}
      className={s.root}
      data-theme={theme}
      data-dragging={dragging ? "true" : "false"}
    >
      <svg
        className={s.shell}
        viewBox={`0 0 ${TRACK} ${BUMP_H + HEIGHT}`}
        aria-hidden
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ss-shell)" />
            <stop offset="1" stopColor="var(--ss-shell-2)" />
          </linearGradient>
        </defs>
        <path
          d={shellPath(center, open, plateauW)}
          fill={`url(#${gradId})`}
          stroke="var(--ss-line)"
          strokeWidth="0.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        ref={labelRef}
        className={s.label}
        style={{
          left: labelX,
          opacity: reveal,
          filter:
            reveal > 0.98
              ? undefined
              : `blur(${((1 - reveal) * 3).toFixed(2)}px)`,
          transform: `translate(-50%, ${3 * (1 - open)}px)`,
        }}
      >
        <span key={level} className={s.swap}>
          <span className={s.current}>{modelLabel}</span>
          <span className={s.next}>{level}</span>
        </span>
      </div>
      <div
        ref={trackRef}
        className={s.track}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-label="Effort de réflexion"
        aria-valuemin={0}
        aria-valuemax={STOPS.length - 1}
        aria-valuenow={active}
        aria-valuetext={`${modelLabel} ${level}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className={s.fill} style={{ width: fillW }} />
        <div
          className={s.thumb}
          style={{
            left: thumbLeft,
            width: thumbW,
            height: thumbH,
            marginTop: -thumbH / 2,
          }}
        />
        {STOPS.map((label, index) => {
          const x = centerFor(index, STOPS.length)
          const onThumb = x >= thumbLeft + 0.5 && x <= thumbRight - 0.5
          return (
            <span
              key={label}
              className={s.tick}
              data-on-thumb={onThumb ? "true" : "false"}
              data-active={index === active && !onThumb ? "true" : "false"}
              style={{ left: x, height: tickHeights[index] ?? 9.6 }}
            />
          )
        })}
      </div>
    </div>
  )
}
