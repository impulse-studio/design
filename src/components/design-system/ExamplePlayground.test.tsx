import { describe, expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ExamplePlayground } from "./ExamplePlayground"
import { CodeBlock } from "./CodeBlock"
import { catalog } from "@/features/design-system/catalog"
import { toast } from "@/components/ui/toast"

describe("terrain de jeu", () => {
  it("synchronise le menu shadcn, l’aperçu et le code copié, puis réinitialise", async () => {
    const user = userEvent.setup()
    const entry = catalog.find((item) => item.id === "button")!
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    const { container } = render(<ExamplePlayground entry={entry} />)
    await screen.findByRole("button", { name: "Créer un projet" })
    expect(container.querySelector("select")).toBeNull()
    await user.click(screen.getByRole("combobox", { name: "Variante" }))
    await user.click(await screen.findByRole("option", { name: "Contour" }))
    await user.click(screen.getByRole("combobox", { name: "État" }))
    await user.click(await screen.findByRole("option", { name: "Désactivé" }))
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Créer un projet" })
          .hasAttribute("disabled")
      ).toBe(true)
    )
    await user.click(screen.getByRole("tab", { name: "Code" }))
    await user.click(
      await screen.findByRole("button", { name: "Copier le code" })
    )
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(writeText.mock.calls[0][0]).toContain('"variant": "outline"')
    expect(writeText.mock.calls[0][0]).toContain('"state": "disabled"')
    await user.click(screen.getByRole("tab", { name: "Aperçu" }))
    await user.click(
      await screen.findByRole("button", { name: "Réinitialiser" })
    )
    expect(
      screen
        .getByRole("button", { name: "Créer un projet" })
        .hasAttribute("disabled")
    ).toBe(false)
    expect(screen.getByRole("combobox", { name: "Variante" }).textContent).toBe(
      "Par défaut"
    )
  })

  it("signale un refus du presse-papiers sans prétendre que la copie a réussi", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
    })
    const addToast = vi.spyOn(toast, "add")
    render(<CodeBlock code="exemple" />)
    fireEvent.click(screen.getByRole("button", { name: "Copier le code" }))
    await waitFor(() =>
      expect(addToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" })
      )
    )
    expect(screen.queryByRole("button", { name: "Copié" })).toBeNull()
  })
})
