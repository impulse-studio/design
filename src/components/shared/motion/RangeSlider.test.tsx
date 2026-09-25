import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RangeSlider } from "./RangeSlider"

describe("RangeSlider", () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 300,
      bottom: 40,
      width: 300,
      height: 40,
      toJSON: () => ({}),
    })
  })
  it("expose une seule poignée et respecte le pas et les bornes au clavier", async () => {
    const onValueChange = vi.fn()
    render(
      <RangeSlider
        aria-label="Intensité"
        defaultValue={40}
        step={10}
        onValueChange={onValueChange}
      />
    )
    const slider = await screen.findByRole("slider", { name: "Intensité" })
    slider.focus()
    await userEvent.keyboard("[ArrowRight]")
    expect(slider.getAttribute("aria-valuenow")).toBe("50")
    expect(onValueChange.mock.calls[0][0]).toBe(50)
    await userEvent.keyboard("[End][ArrowRight]")
    expect(slider.getAttribute("aria-valuenow")).toBe("100")
    await userEvent.keyboard("[Home][ArrowLeft]")
    expect(slider.getAttribute("aria-valuenow")).toBe("0")
  })
  it("suit la valeur contrôlée et désactive les interactions", async () => {
    const onValueChange = vi.fn()
    const { rerender } = render(
      <RangeSlider
        aria-label="Intensité"
        value={20}
        onValueChange={onValueChange}
      />
    )
    rerender(
      <RangeSlider
        aria-label="Intensité"
        value={80}
        disabled
        onValueChange={onValueChange}
      />
    )
    const slider = await screen.findByRole("slider", { name: "Intensité" })
    expect(slider.getAttribute("aria-valuenow")).toBe("80")
    await userEvent.tab()
    expect(document.activeElement).not.toBe(slider)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
