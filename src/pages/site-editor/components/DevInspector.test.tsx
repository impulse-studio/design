import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SiteDevInspector } from "./DevInspector"
import type { SourceElement } from "@/features/sites/source"

const card: SourceElement = {
  id: "card-id",
  file: "src/pages/HomePage.tsx",
  tag: "Card",
  text: null,
  owner: "HomePage",
  kind: "component",
  line: 18,
  signature: "card-signature",
}
const button: SourceElement = {
  id: "button-id",
  file: "src/pages/HomePage.tsx",
  tag: "Button",
  text: null,
  owner: "HomePage",
  kind: "component",
  line: 24,
  signature: "button-signature",
}
const unused: SourceElement = {
  id: "unused-id",
  file: "src/pages/OtherPage.tsx",
  tag: "UnusedCard",
  text: null,
  owner: "OtherPage",
  kind: "component",
  line: 12,
  signature: "unused-signature",
}

describe("SiteDevInspector", () => {
  it("shows component names and opens the selected source", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onOpenFile = vi.fn()

    render(
      <SiteDevInspector
        elements={[card, button, unused]}
        renderedElements={[
          { id: "card-id", count: 2 },
          { id: "button-id", count: 3 },
        ]}
        element={card}
        domTag="div"
        count={2}
        status={"same"}
        statusById={new Map()}
        onSelect={onSelect}
        onOpenFile={onOpenFile}
      />
    )

    expect(screen.getByRole("heading", { name: "Card" })).toBeTruthy()
    expect(screen.queryByText("Balise DOM")).toBeNull()
    expect(screen.queryByText("<div>")).toBeNull()
    expect(screen.queryByText("UnusedCard")).toBeNull()

    await user.click(screen.getByRole("button", { name: /Button/ }))
    expect(onSelect).toHaveBeenCalledWith("button-id")

    await user.click(screen.getByRole("button", { name: /HomePage.tsx:18/ }))
    expect(onOpenFile).toHaveBeenCalledWith("src/pages/HomePage.tsx", 18)
  })
  it("recognizes a component from its rendered HTML even when its JSX props are not forwarded", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const root: SourceElement = {
      ...card,
      id: "table-root",
      tag: "div",
      kind: "html",
      owner: "ContactsTable",
      file: "src/ContactsTable.tsx",
      line: 39,
    }
    const child: SourceElement = {
      ...root,
      id: "table-child",
      tag: "p",
      line: 42,
    }
    render(
      <SiteDevInspector
        elements={[root, child, unused]}
        renderedElements={[
          { id: child.id, count: 26 },
          { id: root.id, count: 1 },
        ]}
        element={root}
        domTag="div"
        count={1}
        status="same"
        statusById={new Map()}
        onSelect={onSelect}
        onOpenFile={vi.fn()}
      />
    )
    expect(screen.getByRole("heading", { name: "ContactsTable" })).toBeTruthy()
    expect(
      screen.getAllByRole("button", { name: "ContactsTable" })
    ).toHaveLength(1)
    expect(screen.queryByText("UnusedCard")).toBeNull()
    await user.click(screen.getByRole("button", { name: "ContactsTable" }))
    expect(onSelect).toHaveBeenCalledWith(root.id)
  })
})
