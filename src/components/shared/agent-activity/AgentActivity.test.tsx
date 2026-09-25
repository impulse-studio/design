import { describe, expect, it } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { AgentActivity } from "./AgentActivity"
import type { AgentActivityItem } from "./types"

describe("AgentActivity", () => {
  it("suit un flux mixte, se replie à la fin et permet de le rouvrir", async () => {
    const items: AgentActivityItem[] = [
      { id: "step", type: "step", label: "Préparer", status: "complete" },
      { id: "tool", type: "tool", action: "read", target: "src/app.tsx" },
      {
        id: "search",
        type: "search",
        query: "Documentation",
        results: [{ id: "docs", title: "Be UI", url: "https://beui.dev" }],
      },
      {
        id: "trace",
        type: "trace",
        kind: "run",
        label: "Tests",
        detail: "pnpm test",
      },
      { id: "text", type: "text", content: "Terminé" },
    ]
    const { rerender } = render(<AgentActivity items={items} />)
    expect(screen.getByRole("status").textContent).toBe("Travail en cours…")
    expect(screen.getAllByRole("listitem")).toHaveLength(5)
    expect(
      screen.getByRole("link", { name: "Be UI" }).getAttribute("href")
    ).toBe("https://beui.dev")
    rerender(<AgentActivity items={items} status="complete" />)
    const trigger = screen.getByRole("button", { name: "5 étapes terminées" })
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    )
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("permet de garder le résultat ouvert et formate la durée", () => {
    render(
      <AgentActivity
        items={[{ id: "one", type: "step", label: "Vérifier" }]}
        status="complete"
        duration={65}
        defaultOpen
      />
    )
    expect(
      screen
        .getByRole("button", { name: "Analyse pendant 1m 5s" })
        .getAttribute("aria-expanded")
    ).toBe("true")
  })
})
