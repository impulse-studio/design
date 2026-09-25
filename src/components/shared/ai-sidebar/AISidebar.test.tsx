import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AISidebar } from "./AISidebar"
import { moveResource } from "./resources"
import type { SidebarResource } from "./types"

const items: SidebarResource[] = [
  {
    id: "folder",
    label: "Pages",
    kind: "folder",
    children: [{ id: "file", label: "Accueil", kind: "file" }],
  },
  { id: "brief", label: "Brief", kind: "file" },
]

describe("AISidebar", () => {
  it("ouvre les dossiers, sélectionne et renomme au clavier", async () => {
    const user = userEvent.setup()
    const select = vi.fn()
    const rename = vi.fn()
    render(
      <AISidebar
        defaultItems={items}
        onActiveChange={select}
        onRename={rename}
      />
    )
    const folder = screen.getByRole("treeitem", { name: /Pages/ })
    expect(folder.getAttribute("tabindex")).toBe("0")
    fireEvent.keyDown(folder, { key: "ArrowRight" })
    const file = screen.getByRole("treeitem", { name: /Accueil/ })
    fireEvent.keyDown(file, { key: "Enter" })
    expect(select).toHaveBeenCalledWith("file")
    fireEvent.keyDown(file, { key: "F2" })
    const input = await screen.findByRole("textbox", {
      name: "Renommer Accueil",
    })
    await user.clear(input)
    await user.type(input, "Inscription{Enter}")
    await waitFor(() =>
      expect(rename).toHaveBeenCalledWith(
        expect.objectContaining({ id: "file" }),
        "Inscription"
      )
    )
    expect(screen.getByRole("treeitem", { name: /Inscription/ })).toBeDefined()
  })

  it("restaure l’ordre après un déplacement refusé", async () => {
    const onMove = vi.fn().mockRejectedValue(new Error("Rejected"))
    const onMoveError = vi.fn()
    render(
      <AISidebar
        defaultItems={items}
        onMove={onMove}
        onMoveError={onMoveError}
      />
    )
    fireEvent.keyDown(screen.getByRole("treeitem", { name: /Brief/ }), {
      key: "ArrowUp",
      altKey: true,
      shiftKey: true,
    })
    await waitFor(() => expect(onMoveError).toHaveBeenCalledOnce())
    expect(screen.getAllByRole("treeitem")[0].textContent).toContain("Pages")
    expect(screen.getByText(/Échec du déplacement/)).toBeDefined()
  })

  it("ouvre les actions et déplace depuis le menu", async () => {
    const user = userEvent.setup()
    const onMove = vi.fn()
    render(<AISidebar defaultItems={items} onMove={onMove} />)
    await user.click(screen.getByRole("button", { name: "Actions pour Brief" }))
    await user.click(await screen.findByRole("button", { name: "Monter" }))
    await waitFor(() =>
      expect(onMove).toHaveBeenCalledWith({
        itemId: "brief",
        targetId: "folder",
        position: "before",
      })
    )
  })

  it("interdit les cycles et les destinations inconnues", () => {
    expect(
      moveResource(items, {
        itemId: "folder",
        targetId: "file",
        position: "inside",
      })
    ).toBeNull()
    expect(
      moveResource(items, {
        itemId: "brief",
        targetId: "missing",
        position: "before",
      })
    ).toBeNull()
  })
})
