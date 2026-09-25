import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ImageGeneration } from "./ImageGeneration"

describe("ImageGeneration", () => {
  it("conserve le format entre la génération, le résultat et l’erreur", () => {
    const canvas = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null)
    const retry = vi.fn()
    const { container, rerender } = render(
      <ImageGeneration
        status="generating"
        label="Paysage"
        aspectRatio="16 / 9"
      />
    )
    expect(container.firstElementChild?.getAttribute("aria-busy")).toBe("true")
    expect(screen.getByRole("img", { name: "Paysage" }).style.aspectRatio).toBe(
      "16 / 9"
    )
    rerender(
      <ImageGeneration status="complete" label="Paysage" aspectRatio="16 / 9">
        <img src="/examples/generated-landscape.svg" alt="Lac" />
      </ImageGeneration>
    )
    expect(container.firstElementChild?.getAttribute("aria-busy")).toBe("false")
    expect(screen.getByRole("img", { name: "Paysage" }).style.aspectRatio).toBe(
      "16 / 9"
    )
    rerender(<ImageGeneration status="error" label="Paysage" onRetry={retry} />)
    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }))
    expect(retry).toHaveBeenCalledOnce()
    canvas.mockRestore()
  })
})
