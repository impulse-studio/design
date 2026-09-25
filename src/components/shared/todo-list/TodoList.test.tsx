import { describe, expect, it } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { TodoList } from "./TodoList"

describe("TodoList", () => {
  it("se replie à la fin et se rouvre quand une tâche reprend", async () => {
    const { rerender } = render(
      <TodoList
        items={[{ id: "1", title: "Préparer", status: "in-progress" }]}
      />
    )
    const trigger = screen.getByRole("button", { name: /Tâches/ })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    rerender(
      <TodoList items={[{ id: "1", title: "Préparer", status: "completed" }]} />
    )
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    )
    rerender(
      <TodoList items={[{ id: "1", title: "Préparer", status: "pending" }]} />
    )
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    )
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
  })

  it("affiche une liste vide sans la considérer terminée", () => {
    render(<TodoList items={[]} />)
    expect(screen.getByText("Aucune tâche")).toBeDefined()
    expect(
      screen
        .getByRole("button", { name: /Tâches/ })
        .getAttribute("aria-expanded")
    ).toBe("true")
  })
})
