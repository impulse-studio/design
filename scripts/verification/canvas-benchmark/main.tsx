import { Profiler, StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import type { FrameNode, TextNode } from "@digit-ai-studio/shared"
import { EditorProvider } from "@/pages/editor/components/shell/EditorProvider"
import { EditorCanvas } from "@/pages/editor/components/canvas/EditorCanvas"
import { InspectorPanel } from "@/pages/editor/components/inspector/InspectorPanel"
import { useCanvasViewport } from "@/features/editor/use-canvas-viewport"
import { createEditor } from "@/features/editor/store"
import { emptyDocument } from "@/features/editor/document"
import { Button } from "@/components/ui/button"
import "./benchmark.css"

const doc = emptyDocument()
doc.pages[0].frames = Array.from({ length: 6 }, (_frame, i): FrameNode => ({
  id: `frame-${i}`,
  type: "frame",
  name: `Frame ${i + 1} · 100 éléments`,
  x: (i % 3) * 880,
  y: Math.floor(i / 3) * 680,
  width: 800,
  height: 600,
  children: Array.from({ length: 100 }, (_text, j): TextNode => ({
    id: `text-${i}-${j}`,
    type: "text",
    name: `Texte ${j}`,
    content: `Élément ${j + 1}`,
    fontSize: 14,
    layout: {
      position: { x: (j % 10) * 78 + 10, y: Math.floor(j / 10) * 55 + 12 },
      width: { mode: "fixed", value: 72 },
      height: { mode: "fixed", value: 32 },
    },
  })),
}))
const editor = createEditor({ name: "Benchmark", status: "draft", doc })
editor.select("text-0-0")
let inspectorRenders = 0
const errors: string[] = []
window.addEventListener("error", (event) => errors.push(event.message))
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason))
)
const tick = () =>
  new Promise<number>((resolve) => requestAnimationFrame(resolve))

const runBenchmark = async (surface: HTMLElement) => {
  const baseline = editor.state.get().doc
  let documentWrites = 0,
    fullMessages = 0,
    geometryMessages = 0
  let previous = baseline
  const subscription = editor.state.subscribe((state) => {
    if (previous !== state.doc) {
      documentWrites++
      previous = state.doc
    }
  })
  const restores: (() => void)[] = []
  for (const iframe of surface.querySelectorAll("iframe")) {
    const target = iframe.contentWindow
    if (!target) continue
    const original = target.postMessage.bind(target)
    target.postMessage = ((message: { type?: string }, origin: string) => {
      if (message.type === "init" || message.type === "replace") fullMessages++
      if (message.type === "geometry-preview") geometryMessages++
      original(message, origin)
    }) as typeof target.postMessage
    restores.push(() => {
      target.postMessage = original
    })
  }
  inspectorRenders = 0
  const intervals: number[] = []
  let previousTime = await tick()
  const frame = async () => {
    const now = await tick()
    intervals.push(now - previousTime)
    previousTime = now
  }
  const bounds = surface.getBoundingClientRect()
  try {
    for (let i = 0; i < 120; i++) {
      surface.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          clientX: bounds.x + bounds.width / 2,
          clientY: bounds.y + bounds.height / 2,
          deltaX: i < 60 ? 3 : -3,
          deltaY: i < 60 ? 1 : -1,
        })
      )
      await frame()
    }
    for (let i = 0; i < 120; i++) {
      surface.dispatchEvent(
        new WheelEvent("wheel", {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
          clientX: bounds.x + bounds.width / 2,
          clientY: bounds.y + bounds.height / 2,
          deltaY: i < 60 ? -1 : 1,
        })
      )
      await frame()
    }
    const navigation = {
      inspectorRenders,
      documentWrites,
      fullMessages,
      geometryMessages,
    }
    // Native pointer capture requires a trusted input; the manual drag check below covers it.
    // The workload exercises the exact preview path while leaving the fixture document intact.
    const node = editor.state.get().layouts["frame-0"]?.rects["text-0-0"]
    const session = editor.canvas.nextSession()
    if (node)
      for (let i = 0; i < 120; i++) {
        editor.canvas.setVisual({
          preview: {
            session,
            rects: {
              "text-0-0": { ...node, x: node.x + i / 2, width: 72 + i / 3 },
            },
            frames: {
              "frame-0": [
                {
                  nodeId: "text-0-0",
                  x: node.x + i / 2,
                  y: node.y,
                  width: 72 + i / 3,
                  height: 32,
                },
              ],
            },
          },
        })
        await frame()
      }
    editor.canvas.reset()
    await frame()
    const sorted = [...intervals].sort((a, b) => a - b),
      mean = intervals.reduce((sum, value) => sum + value, 0) / intervals.length
    return {
      browser: navigator.userAgent,
      frames: 6,
      elements: 600,
      fps: Math.round(1000 / mean),
      p95ms: Number(sorted[Math.floor(sorted.length * 0.95)].toFixed(1)),
      pausesOver50ms: intervals.filter((value) => value > 50).length,
      navigation,
      total: {
        inspectorRenders,
        documentWrites,
        fullMessages,
        geometryMessages,
      },
      errors: [...errors],
    }
  } finally {
    subscription.unsubscribe()
    restores.forEach((restore) => restore())
  }
}

export function Benchmark() {
  const { surface, fit, zoomTo } = useCanvasViewport()
  const [result, setResult] = useState(
    "Prêt — attendre le chargement des six frames."
  )
  const [running, setRunning] = useState(false)
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 12, padding: 8 }}>
        <Button
          disabled={running}
          onClick={async () => {
            if (!surface.current) return
            setRunning(true)
            setResult("Mesure en cours…")
            try {
              setResult(
                JSON.stringify(await runBenchmark(surface.current), null, 2)
              )
            } catch (error) {
              setResult(String(error))
            } finally {
              setRunning(false)
            }
          }}
        >
          Mesurer 600 éléments
        </Button>
        <Button variant="outline" onClick={() => fit()}>
          Recentrer
        </Button>
        <span>
          Diagnostic local · aucune sauvegarde · glisser les titres et les
          poignées pour tester.
        </span>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <EditorCanvas
            surface={surface}
            fit={fit}
            zoomTo={zoomTo}
            showZoom
            toggleLeft={() => {}}
            toggleRight={() => {}}
          />
        </div>
        <aside style={{ width: 320, overflow: "auto" }}>
          <Profiler
            id="inspector"
            onRender={() => {
              inspectorRenders++
            }}
          >
            <InspectorPanel fit={fit} zoomTo={zoomTo} />
          </Profiler>
        </aside>
      </div>
      <pre
        aria-label="Résultat du benchmark"
        style={{
          maxHeight: 220,
          overflow: "auto",
          margin: 0,
          padding: 8,
          fontSize: 12,
        }}
      >
        {result}
      </pre>
    </div>
  )
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EditorProvider editor={editor}>
      <Benchmark />
    </EditorProvider>
  </StrictMode>
)
