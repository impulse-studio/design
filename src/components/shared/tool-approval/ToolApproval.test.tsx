import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ToolApproval } from "./ToolApproval"
import { ToolApprovalCode } from "./ToolApprovalCode"

describe("ToolApproval", () => {
  it("transmet chaque décision et masque les actions pendant l’exécution", () => {
    const approve = vi.fn()
    const always = vi.fn()
    const deny = vi.fn()
    const { rerender } = render(
      <ToolApproval
        tool="terminal"
        onApprove={approve}
        onAlwaysAllow={always}
        onDeny={deny}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Autoriser une fois" }))
    fireEvent.click(screen.getByRole("button", { name: "Toujours autoriser" }))
    fireEvent.click(screen.getByRole("button", { name: "Refuser" }))
    expect(approve).toHaveBeenCalledOnce()
    expect(always).toHaveBeenCalledOnce()
    expect(deny).toHaveBeenCalledOnce()
    rerender(
      <ToolApproval
        tool="terminal"
        status="running"
        onApprove={approve}
        onDeny={deny}
      />
    )
    expect(
      screen.queryByRole("button", { name: "Autoriser une fois" })
    ).toBeNull()
    expect(screen.queryByRole("button", { name: "Refuser" })).toBeNull()
    expect(screen.getByRole("status").textContent).toBe("Exécution en cours")
  })

  it("ouvre les paramètres et les replie après une décision", async () => {
    const parameters = [
      {
        id: "command",
        label: "Commande",
        value: <ToolApprovalCode code="pnpm test" />,
      },
    ]
    const { rerender } = render(
      <ToolApproval tool="terminal" parameters={parameters} />
    )
    const trigger = screen.getByRole("button", { name: "Voir les détails" })
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(
      screen.getByRole("region", { name: "Code de l’exemple" }).textContent
    ).toContain("pnpm test")
    rerender(
      <ToolApproval tool="terminal" parameters={parameters} status="denied" />
    )
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    )
  })
})
