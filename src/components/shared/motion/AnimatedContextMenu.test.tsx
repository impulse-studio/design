import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { AnimatedContextMenuContent } from "./AnimatedContextMenuContent"
import { AnimatedContextMenuItem } from "./AnimatedContextMenuItem"

describe("AnimatedContextMenu", () => {
  it("ouvre au clic droit et exécute une action", async () => {
    const onClick = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger tabIndex={0}>Document</ContextMenuTrigger>
        <AnimatedContextMenuContent>
          <AnimatedContextMenuItem onClick={onClick}>
            Ouvrir
          </AnimatedContextMenuItem>
          <AnimatedContextMenuItem disabled>Partager</AnimatedContextMenuItem>
        </AnimatedContextMenuContent>
      </ContextMenu>
    )
    fireEvent.contextMenu(screen.getByText("Document"), {
      clientX: 40,
      clientY: 40,
    })
    const item = await screen.findByRole("menuitem", { name: "Ouvrir" })
    expect(
      screen
        .getByRole("menuitem", { name: "Partager" })
        .hasAttribute("data-disabled")
    ).toBe(true)
    await userEvent.click(item)
    expect(onClick).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  it("ouvre au clavier et restitue le focus après Échap", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger tabIndex={0}>Document</ContextMenuTrigger>
        <AnimatedContextMenuContent>
          <AnimatedContextMenuItem>Ouvrir</AnimatedContextMenuItem>
        </AnimatedContextMenuContent>
      </ContextMenu>
    )
    screen.getByText("Document").focus()
    // Browsers dispatch contextmenu for the Menu key; jsdom does not.
    fireEvent.contextMenu(screen.getByText("Document"), { button: 0 })
    await screen.findByRole("menu")
    await userEvent.keyboard("[Escape]")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    expect(document.activeElement).toBe(screen.getByText("Document"))
  })
})
