"use client"

import type { CSSProperties } from "react"
import styles from "./Orb.module.css"
import {
  STAGE,
  SIZE,
  ORB_TASKS,
  isLattice,
  isRing,
  isHelix,
  isMorph,
  latticeCells,
  ringDots,
  globeDots,
  morphDots,
} from "./geometry"
import type { OrbProps } from "./geometry"

export function Orb({
  variant = "S1",
  size = SIZE,
  label,
  pill,
  className,
  style,
}: OrbProps) {
  const text = label ?? ORB_TASKS[variant] + "…"
  return (
    <span
      className={styles.root + (className ? " " + className : "")}
      data-pill={pill ? "" : undefined}
      style={style}
    >
      <span
        className={styles.glyph}
        // In pill form the visible label already carries the meaning, so
        // the glyph steps out of the accessibility tree.
        role={pill ? undefined : "img"}
        aria-label={pill ? undefined : text}
        aria-hidden={pill ? true : undefined}
        style={
          {
            width: size,
            height: size,
            "--orb-k": size / STAGE,
          } as CSSProperties
        }
      >
        {isLattice(variant) ? (
          <span className={styles.lattice} data-variant={variant}>
            {latticeCells(variant).map((c) => (
              <span
                key={c.key}
                className={styles.cell}
                data-still={c.still ? "" : undefined}
                data-mid={c.mid ? "" : undefined}
                style={
                  {
                    left: c.left,
                    top: c.top,
                    animationDelay: c.delay + "ms",
                    "--orb-ax": c.ax + "px",
                    "--orb-ay": c.ay + "px",
                    "--orb-bx": c.bx + "px",
                    "--orb-by": c.by + "px",
                  } as CSSProperties
                }
              />
            ))}
          </span>
        ) : isRing(variant) ? (
          <span className={styles.ring} data-variant={variant}>
            {ringDots(variant).map((d) => (
              <span
                key={d.key}
                className={styles.ringDot}
                style={
                  {
                    "--orb-rx": d.rx + "px",
                    "--orb-ry": d.ry + "px",
                    animationDelay: d.delay + "ms",
                  } as CSSProperties
                }
              />
            ))}
          </span>
        ) : isHelix(variant) ? (
          <span className={styles.helix} data-variant={variant}>
            {globeDots(variant).map((d) => (
              <span
                key={d.key}
                className={styles.helixDot}
                style={d.style as CSSProperties}
              />
            ))}
          </span>
        ) : isMorph(variant) ? (
          <span className={styles.morph} data-variant={variant}>
            {morphDots(variant).map((d) => (
              <span
                key={d.key}
                className={styles.morphDot}
                style={
                  {
                    "--m-1": d.m1,
                    "--m-2": d.m2,
                    "--m-3": d.m3,
                    "--m-4": d.m4,
                    "--m-depth": d.depth,
                    animationDelay: d.delay,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        ) : (
          <span className={styles.lens} data-variant={variant}>
            <span className={styles.shape + " " + styles.shapeA} />
            <span className={styles.shape + " " + styles.shapeB} />
            <span className={styles.shape + " " + styles.shapeC} />
            {/* focus is the one variant that needs a fourth circle: its cast
                sits on the corners of a square, and three corners do not
                make a square. */}
            {variant === "B1" && (
              <span className={styles.shape + " " + styles.shapeD} />
            )}
          </span>
        )}
      </span>
      {pill && <span className={styles.pillLabel}>{text}</span>}
    </span>
  )
}

/* Usage:
       <Orb variant="S4" />
       <Orb variant="B4" size={40} />
       <Orb variant="C3" />
       <Orb variant="B2" label="Searching the web…" pill />
 */
