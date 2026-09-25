import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { ChatApp } from "./ChatApp"
import { ChatNavigation } from "./ChatNavigation"

const originalObserver = globalThis.ResizeObserver

afterEach(() => vi.stubGlobal("ResizeObserver", originalObserver))

describe("ChatApp", () => {
  it("replie la navigation quand le panneau devient étroit", () => {
    let measure: ResizeObserverCallback | undefined
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          measure = callback
        }
        observe() {}
        disconnect() {}
      }
    )
    const onOpenChange = vi.fn()
    render(
      <ChatApp defaultOpen onOpenChange={onOpenChange}>
        Conversation
      </ChatApp>
    )
    act(() =>
      measure?.(
        [{ contentRect: { width: 400 } } as ResizeObserverEntry],
        {} as ResizeObserver
      )
    )
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    act(() =>
      measure?.(
        [{ contentRect: { width: 900 } } as ResizeObserverEntry],
        {} as ResizeObserver
      )
    )
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it("respecte une ouverture contrôlée sans observer la largeur", () => {
    const observer = vi.fn()
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor() {
          observer()
        }
        observe() {}
        disconnect() {}
      }
    )
    render(<ChatApp open={false}>Conversation</ChatApp>)
    expect(observer).not.toHaveBeenCalled()
  })

  it("ouvre les conversations sans modifier le cookie ni répondre au raccourci global", () => {
    const onNewChat = vi.fn()
    const cookie = document.cookie
    render(
      <ChatApp defaultOpen={false}>
        <ChatNavigation onNewChat={onNewChat} />
      </ChatApp>
    )
    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(
      screen.queryByRole("button", { name: "Nouvelle conversation" })
    ).toBeNull()
    fireEvent.click(
      screen.getByRole("button", {
        name: "Afficher ou masquer les conversations",
      })
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Nouvelle conversation" })
    )
    expect(onNewChat).toHaveBeenCalledOnce()
    expect(document.cookie).toBe(cookie)
  })
})
