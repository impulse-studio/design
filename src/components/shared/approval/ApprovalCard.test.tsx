import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ApprovalCard } from "./ApprovalCard"

describe("ApprovalCard", () => {
  it("déclenche les décisions et bloque les actions pendant l’envoi", () => {
    const approve = vi.fn()
    const reject = vi.fn()
    const changes = vi.fn()
    const { rerender } = render(
      <ApprovalCard
        onApprove={approve}
        onReject={reject}
        onRequestChanges={changes}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Approuver" }))
    fireEvent.click(screen.getByRole("button", { name: "Refuser" }))
    fireEvent.click(
      screen.getByRole("button", { name: "Demander des modifications" })
    )
    expect(approve).toHaveBeenCalledOnce()
    expect(reject).toHaveBeenCalledOnce()
    expect(changes).toHaveBeenCalledOnce()
    rerender(<ApprovalCard status="submitting" onApprove={approve} />)
    expect(
      screen.getByRole("button", { name: "Approuver" }).hasAttribute("disabled")
    ).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Approuver" }))
    expect(approve).toHaveBeenCalledOnce()
  })

  it("collecte les réponses à choix unique, multiples et libres", async () => {
    const user = userEvent.setup()
    const submit = vi.fn()
    render(
      <ApprovalCard
        onSubmit={submit}
        questions={[
          {
            id: "access",
            title: "Accès",
            options: [{ value: "public", label: "Public" }],
          },
          {
            id: "features",
            title: "Fonctionnalités",
            multiple: true,
            allowCustom: true,
            options: [{ value: "email", label: "E-mail" }],
          },
        ]}
      />
    )
    expect(
      screen
        .getByRole("button", { name: "Question suivante" })
        .hasAttribute("disabled")
    ).toBe(true)
    await user.click(screen.getByRole("radio", { name: "Public" }))
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: "E-mail" })).toBeDefined()
    )
    await user.click(screen.getByRole("checkbox", { name: "E-mail" }))
    await user.type(
      screen.getByRole("textbox", { name: "Autre réponse" }),
      "SMS"
    )
    await user.click(screen.getByRole("button", { name: "Envoyer la réponse" }))
    expect(submit).toHaveBeenCalledWith({
      access: { selected: ["public"], custom: "" },
      features: { selected: ["email"], custom: "SMS" },
    })
  })
})
