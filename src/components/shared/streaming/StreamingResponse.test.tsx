import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { StreamingResponse } from "./StreamingResponse"
import { toast } from "@/components/ui/toast"

describe("StreamingResponse", () => {
  it("affiche les actions à la fin et ouvre les sources", async () => {
    const copy = vi.fn().mockResolvedValue(undefined)
    const { rerender } = render(
      <StreamingResponse onCopy={copy}>Réponse</StreamingResponse>
    )
    expect(
      screen.queryByRole("button", { name: "Copier la réponse" })
    ).toBeNull()
    rerender(
      <StreamingResponse
        status="complete"
        onCopy={copy}
        sources={[
          { id: "docs", title: "Documentation", url: "https://beui.dev" },
        ]}
      >
        Réponse
      </StreamingResponse>
    )
    fireEvent.click(screen.getByRole("button", { name: "Copier la réponse" }))
    await screen.findByRole("button", { name: "Copié" })
    expect(copy).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole("button", { name: "1 source" }))
    expect(
      screen.getByRole("link", { name: /Documentation/ }).getAttribute("href")
    ).toBe("https://beui.dev")
  })

  it("signale une copie échouée et respecte un avis contrôlé à null", async () => {
    const onCopy = vi.fn().mockRejectedValue(new Error("Denied"))
    const notify = vi.spyOn(toast, "add")
    const feedback = vi.fn()
    render(
      <StreamingResponse
        status="complete"
        onCopy={onCopy}
        feedback={null}
        defaultFeedback="up"
        onFeedbackChange={feedback}
      >
        Réponse
      </StreamingResponse>
    )
    expect(
      screen.getByRole("button", { name: "Utile" }).getAttribute("aria-pressed")
    ).toBe("false")
    fireEvent.click(screen.getByRole("button", { name: "Utile" }))
    expect(feedback).toHaveBeenCalledWith("up")
    fireEvent.click(screen.getByRole("button", { name: "Copier la réponse" }))
    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error" })
      )
    )
    expect(screen.queryByRole("button", { name: "Copié" })).toBeNull()
    notify.mockRestore()
  })
})
