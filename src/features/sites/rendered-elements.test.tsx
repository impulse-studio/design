import { render } from "@testing-library/react"
import { createPortal } from "react-dom"
import { describe, expect, it, vi } from "vitest"
import { collectRenderedElements } from "./rendered-elements"
import { bridgeSource } from "./bridge"

const Cell = (_props: { "data-digi-id": string }) => (
  <>
    <span>Cell</span>
    <span>Details</span>
  </>
)
const Table = (_props: { "data-digi-id": string }) => (
  <div data-digi-id="table-dom">
    <Cell data-digi-id="cell" />
    <Cell data-digi-id="cell" />
    {createPortal(<Cell data-digi-id="portal" />, document.body)}
  </div>
)

describe("rendered source components", () => {
  it("finds nested components without forwarded props, counts instances and includes portals", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 100,
      bottom: 20,
      width: 100,
      height: 20,
      toJSON: () => ({}),
    })
    const root = document.createElement("div")
    document.body.append(root)
    const view = render(<Table data-digi-id="table" />, { container: root })
    const result = collectRenderedElements(root)
    expect(result.entries.get("table")?.instances.size).toBe(1)
    expect(result.entries.get("cell")?.instances.size).toBe(2)
    expect(result.entries.get("cell")?.elements.size).toBe(4)
    expect(result.entries.get("portal")?.instances.size).toBe(1)
    expect(result.componentIds.get(root.querySelector("span")!)).toBe("cell")
    expect(result.entries.has("table-dom")).toBe(true)
    view.rerender(<div data-digi-id="replacement" />)
    expect(collectRenderedElements(root).entries.has("cell")).toBe(false)
    view.unmount()
    root.remove()
  })

  it("does not list components whose DOM is hidden", () => {
    const root = document.createElement("div")
    const view = render(<Table data-digi-id="table" />, { container: root })
    expect(collectRenderedElements(root).entries.size).toBe(0)
    view.unmount()
  })

  it("embeds a standalone collector in the preview script", () => {
    const script = bridgeSource("token", 1, "/", true, false)
    expect(() => new Function(script)).not.toThrow()
  })
})
