import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ApprovalCard } from "./ApprovalCard"

describe("validation des réponses", () => {
  it("revient à une question manquante avant de permettre un nouvel envoi", async () => {
    const user = userEvent.setup()
    const submit = vi.fn()
    render(
      <ApprovalCard
        defaultStep={1}
        defaultAnswers={{ second: { selected: ["yes"], custom: "" } }}
        questions={[
          {
            id: "first",
            title: "Premier choix",
            autoAdvance: false,
            options: [{ value: "first-choice", label: "Première réponse" }],
          },
          {
            id: "second",
            title: "Second choix",
            options: [{ value: "yes", label: "Oui" }],
          },
        ]}
        onSubmit={submit}
      />
    )
    await user.click(screen.getByRole("button", { name: "Envoyer la réponse" }))
    await screen.findByRole("radio", { name: "Première réponse" })
    expect(submit).not.toHaveBeenCalled()
    expect(screen.getByRole("alert").textContent).toContain(
      "Choisissez une réponse"
    )
    await user.click(screen.getByRole("radio", { name: "Première réponse" }))
    await user.click(screen.getByRole("button", { name: "Question suivante" }))
    await screen.findByRole("radio", { name: "Oui" })
    await user.click(screen.getByRole("button", { name: "Envoyer la réponse" }))
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        first: { selected: ["first-choice"], custom: "" },
        second: { selected: ["yes"], custom: "" },
      })
    )
  })
})
