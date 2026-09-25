import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { PromptInput } from "./PromptInput"

describe("PromptInput", () => {
  it("respecte submitDisabled au clavier et lors de la soumission du formulaire", () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <PromptInput
        defaultValue="Un brouillon"
        submitDisabled
        onSubmit={onSubmit}
      />
    )
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Prompt" }), {
      key: "Enter",
    })
    fireEvent.submit(container.querySelector("form")!)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("autorise une pièce jointe sans texte quand le parent la valide", async () => {
    const onSubmit = vi.fn()
    render(<PromptInput allowEmpty onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith("", undefined))
  })
  it("envoie avec Entrée, conserve Maj+Entrée et ignore les messages vides", async () => {
    const onSubmit = vi.fn()
    render(<PromptInput onSubmit={onSubmit} defaultModel="standard" />)
    const input = screen.getByRole("textbox", { name: "Prompt" })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: " Bonjour " } })
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: "Enter", isComposing: true })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: "Enter" })
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith("Bonjour", "standard")
    )
    await waitFor(() => expect((input as HTMLTextAreaElement).value).toBe(""))
  })

  it("arrête la génération et respecte l’état désactivé", () => {
    const onStop = vi.fn()
    const { rerender } = render(<PromptInput loading onStop={onStop} />)
    fireEvent.click(screen.getByRole("button", { name: "Arrêter" }))
    expect(onStop).toHaveBeenCalledOnce()
    rerender(<PromptInput loading disabled onStop={onStop} />)
    expect(
      screen.getByRole("button", { name: "Arrêter" }).hasAttribute("disabled")
    ).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Arrêter" }))
    expect(onStop).toHaveBeenCalledOnce()
  })
})
