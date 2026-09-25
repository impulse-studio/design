import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FileDiff } from "./FileDiff"

describe("FileDiff", () => {
  it("scrolls the focused source line into view", () => {
    const scrollIntoView = vi
      .spyOn(Element.prototype, "scrollIntoView")
      .mockImplementation(() => {})

    render(
      <FileDiff
        file="src/pages/HomePage.tsx"
        mode="code"
        focusLine={2}
        rows={[
          {
            old: null,
            cur: 1,
            type: "ctx",
            text: "export function HomePage() {",
          },
          { old: null, cur: 2, type: "ctx", text: "  return <main />" },
        ]}
      />
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      block: "center",
      inline: "nearest",
    })
  })
})
