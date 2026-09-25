import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { demoDoc } from "@digit-ai-studio/shared"
import { EditorContext } from "@/features/editor/context"
import { createEditor } from "@/features/editor/store"
import { EditorDemoChat as EditorChat } from "./EditorDemoChat"
import { ChatSessionProvider } from "@/components/shared/chat/ChatSessionProvider"
import { ChatMarkdown } from "@/components/shared/chat/ChatMarkdown"
import { chatStorageKey } from "@/features/chat/storage"

const setup = (id = "test-chat") => {
  const editor = createEditor({
    name: "Test",
    status: "draft",
    doc: structuredClone(demoDoc),
  })
  const view = (visible = true) => (
    <EditorContext.Provider value={editor}>
      <ChatSessionProvider mockupId={id}>
        {visible && <EditorChat mockupId={id} />}
      </ChatSessionProvider>
    </EditorContext.Provider>
  )
  const result = render(view())
  return { ...result, editor, view }
}
beforeEach(() => localStorage.clear())

describe("chat de l’éditeur", () => {
  it("réalise le parcours interactif sans toucher au document ni appeler une IA", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
    const { editor } = setup()
    const original = editor.state.get().doc
    fireEvent.click(screen.getByRole("button", { name: "Essayer la démo" }))
    fireEvent.click(screen.getByRole("button", { name: /Créer une page/ }))
    await screen.findByRole("radio", { name: /Un tableau compact/ })
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }))
    expect(screen.getByRole("alert").textContent).toBe(
      "Choisissez une réponse ou écrivez la vôtre."
    )
    fireEvent.click(screen.getByRole("radio", { name: /Un tableau compact/ }))
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }))
    fireEvent.click(screen.getByRole("checkbox", { name: /Recherche/ }))
    fireEvent.click(screen.getByRole("checkbox", { name: /Filtres/ }))
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }))
    fireEvent.change(
      screen.getByRole("textbox", { name: /Réponse libre : Un détail/ }),
      { target: { value: "Priorité au clavier" } }
    )
    fireEvent.click(screen.getByRole("button", { name: "Valider" }))
    await screen.findByRole("button", { name: "Valider le plan" })
    expect(
      screen.getByText(/Recherche, Filtres/, { selector: "p" })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Valider le plan" }))
    fireEvent.click(screen.getByRole("button", { name: "Autoriser une fois" }))
    await screen.findByRole(
      "heading",
      { name: "Votre proposition est prête" },
      { timeout: 7000 }
    )
    await screen.findByRole(
      "button",
      { name: "Copier la réponse" },
      { timeout: 7000 }
    )
    expect(editor.state.get().doc).toBe(original)
    expect(editor.state.get().past).toHaveLength(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  }, 15000)

  it("conserve brouillons, modèle et fichiers pendant un changement d’onglet", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fixture")
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    const { rerender, view, unmount } = setup("tabs")
    fireEvent.change(
      screen.getByRole("textbox", { name: "Message à l’assistant" }),
      { target: { value: "Mon brouillon normal" } }
    )
    fireEvent.keyDown(
      screen.getByRole("textbox", { name: "Message à l’assistant" }),
      { key: "Enter" }
    )
    expect(screen.queryByText("Vous", { exact: true })).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Essayer la démo" }))
    fireEvent.change(
      screen.getByRole("textbox", { name: "Message à l’assistant" }),
      { target: { value: "Mon brouillon de démo" } }
    )
    fireEvent.change(screen.getByLabelText("Joindre des fichiers"), {
      target: {
        files: [new File(["brief"], "brief.md", { type: "text/plain" })],
      },
    })
    rerender(view(false))
    rerender(view(true))
    expect(
      screen.getByRole<HTMLTextAreaElement>("textbox", {
        name: "Message à l’assistant",
      }).value
    ).toBe("Mon brouillon de démo")
    expect(screen.getByText("brief.md")).toBeTruthy()
    expect(revoke).not.toHaveBeenCalled()
    unmount()
    expect(revoke).toHaveBeenCalledWith("blob:fixture")
    expect(localStorage.getItem(chatStorageKey("tabs"))).not.toContain(
      "blob:fixture"
    )
    setup("tabs")
    expect(
      screen.getByRole<HTMLTextAreaElement>("textbox", {
        name: "Message à l’assistant",
      }).value
    ).toBe("Mon brouillon normal")
    fireEvent.click(screen.getByRole("button", { name: "Essayer la démo" }))
    expect(screen.getByText("À joindre à nouveau")).toBeTruthy()
    expect(
      screen.getByRole("button", { name: "Envoyer" }).hasAttribute("disabled")
    ).toBe(true)
  })

  it("garde les réponses et la question courante après démontage du panneau", async () => {
    const { rerender, view } = setup()
    fireEvent.click(screen.getByRole("button", { name: "Essayer la démo" }))
    fireEvent.click(screen.getByRole("button", { name: /Créer une page/ }))
    await screen.findByRole("radio", { name: /Un tableau compact/ })
    fireEvent.click(screen.getByRole("radio", { name: /Un tableau compact/ }))
    fireEvent.click(screen.getByRole("button", { name: "Suivant" }))
    fireEvent.click(screen.getByRole("checkbox", { name: /Recherche/ }))
    rerender(view(false))
    rerender(view(true))
    expect(
      screen.getByRole<HTMLInputElement>("checkbox", { name: /Recherche/ })
        .checked
    ).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Passer" }))
    fireEvent.click(screen.getByRole("button", { name: "Passer" }))
    await screen.findByRole("button", { name: "Valider le plan" })
    const answers = screen
      .getByText("Vos réponses")
      .closest('[data-slot="card"]')!
    expect(
      within(answers as HTMLElement).getByText(/Sans préférence/)
    ).toBeTruthy()
  })

  it("annule les traitements quand on quitte la démo", async () => {
    setup()
    fireEvent.click(screen.getByRole("button", { name: "Essayer la démo" }))
    fireEvent.click(screen.getByRole("button", { name: /Tester une erreur/ }))
    fireEvent.click(screen.getByRole("button", { name: "Arrêter" }))
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Arrêter" })).toBeNull()
    )
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 750))
    })
    expect(screen.queryByText("Interruption simulée")).toBeNull()
    expect(screen.getByText(/résultat partiel conservé/)).toBeTruthy()
  })
})

describe("TanStack Markdown", () => {
  it("rend listes, tableaux et code sans interpréter HTML ni charger des images distantes", () => {
    const { container } = render(
      <ChatMarkdown
        text={
          "# Titre\n\n- Un élément\n\n| Nom | Valeur |\n| --- | --- |\n| A | B |\n\n```tsx\n<Button />\n```\n\n<script>alert(1)</script>\n\n![externe](https://example.com/tracker.png)\n\n[lien](javascript:alert(1))"
        }
      />
    )
    expect(screen.getByRole("heading", { name: "Titre" })).toBeTruthy()
    expect(screen.getByRole("table")).toBeTruthy()
    expect(container.querySelector("pre code")?.textContent).toContain(
      "<Button />"
    )
    expect(container.querySelector("script")).toBeNull()
    expect(container.querySelector("img")).toBeNull()
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull()
  })
})
