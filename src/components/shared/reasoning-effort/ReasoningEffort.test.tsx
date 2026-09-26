import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ReasoningEffort } from "@/components/shared/reasoning-effort/ReasoningEffort"

const EFFORTS = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyen" },
  { value: "high", label: "Élevé" },
  { value: "xhigh", label: "Très élevé" },
]

describe("ReasoningEffort aicss", () => {
  it("relie le contrôle original à l’effort choisi et reste utilisable au clavier", () => {
    const onValueChange = vi.fn()
    const { container, rerender } = render(
      <ReasoningEffort
        value="medium"
        options={EFFORTS}
        modelLabel="Opus"
        onValueChange={onValueChange}
      />
    )
    const slider = screen.getByRole("slider", { name: "Effort de réflexion" })
    expect(container.querySelector("svg path")).toBeTruthy()
    expect(slider.getAttribute("aria-valuetext")).toBe("Opus Moyen")
    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith("high")
    rerender(
      <ReasoningEffort
        value="xhigh"
        options={EFFORTS}
        modelLabel="Opus"
        onValueChange={onValueChange}
      />
    )
    expect(slider.getAttribute("aria-valuenow")).toBe("3")
    expect(slider.getAttribute("aria-valuetext")).toBe("Opus Très élevé")
    fireEvent.keyDown(slider, { key: "Home" })
    expect(onValueChange).toHaveBeenLastCalledWith("low")
    rerender(
      <ReasoningEffort
        value="low"
        options={EFFORTS}
        disabled
        onValueChange={onValueChange}
      />
    )
    onValueChange.mockClear()
    fireEvent.keyDown(slider, { key: "End" })
    expect(onValueChange).not.toHaveBeenCalled()
    expect(slider.getAttribute("tabindex")).toBe("-1")
  })
})
