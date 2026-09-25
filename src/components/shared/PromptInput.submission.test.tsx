import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { PromptInput } from "./PromptInput"

describe("soumission des prompts", () => {
  it("bloque les doubles envois et conserve le texte après une erreur", async () => {
    let rejectRequest: (reason: Error) => void = () => {}
    const submit = vi.fn(
      () =>
        new Promise<void>((_, reject) => {
          rejectRequest = reject
        })
    )
    const { container } = render(
      <PromptInput defaultValue="Mon brouillon" onSubmit={submit} />
    )
    const input = screen.getByRole("textbox", { name: "Prompt" })
    const form = container.querySelector("form")!
    fireEvent.submit(form)
    fireEvent.submit(form)
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    expect(screen.getByRole("button", { name: "Envoyer" })).toHaveProperty(
      "disabled",
      true
    )
    expect(input).toHaveProperty("value", "Mon brouillon")
    await act(async () => rejectRequest(new Error("Offline")))
    await screen.findByText("Le message n’a pas pu être envoyé. Réessayez.")
    expect(input).toHaveProperty("value", "Mon brouillon")
    expect(screen.getByRole("button", { name: "Envoyer" })).toHaveProperty(
      "disabled",
      false
    )
  })

  it("conserve le nouveau brouillon saisi pendant un envoi", async () => {
    let resolveRequest: () => void = () => {}
    const submit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRequest = resolve
        })
    )
    render(<PromptInput defaultValue="Premier message" onSubmit={submit} />)
    const input = screen.getByRole("textbox", { name: "Prompt" })
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }))
    await waitFor(() => expect(submit).toHaveBeenCalledOnce())
    fireEvent.change(input, { target: { value: "Prochain message" } })
    await act(async () => resolveRequest())
    expect(input).toHaveProperty("value", "Prochain message")
  })

  it("envoie les dernières valeurs contrôlées sans effacer la saisie du parent", async () => {
    const submit = vi.fn()
    const change = vi.fn()
    const { rerender } = render(
      <PromptInput
        value="Avant"
        model="first"
        onValueChange={change}
        onSubmit={submit}
      />
    )
    rerender(
      <PromptInput
        value=" Après "
        model="second"
        onValueChange={change}
        onSubmit={submit}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }))
    await waitFor(() => expect(submit).toHaveBeenCalledWith("Après", "second"))
    expect(screen.getByRole("textbox", { name: "Prompt" })).toHaveProperty(
      "value",
      " Après "
    )
    expect(change).not.toHaveBeenCalled()
  })
})
