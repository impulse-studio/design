import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { EditSessionContext } from "./edit-session"
import { usePointerEditGesture } from "./use-pointer-edit-gesture"

const GestureHarness = () => {
  const gesture = usePointerEditGesture<HTMLDivElement>({ onMove: () => {} })
  return <div data-testid="target" {...gesture} />
}

const setup = () => {
  const session = {
    begin: vi.fn(),
    commit: vi.fn(),
    cancel: vi.fn(),
  }
  const view = render(
    <EditSessionContext.Provider value={session}>
      <GestureHarness />
    </EditSessionContext.Provider>
  )
  const target = view.getByTestId("target")
  target.setPointerCapture = vi.fn()
  return { session, target }
}

describe("pointer edit gesture", () => {
  it("commits once when lost capture follows pointer up", () => {
    const { session, target } = setup()
    fireEvent.pointerDown(target, { button: 0, pointerId: 1 })
    fireEvent.pointerUp(target, { button: 0, pointerId: 1 })
    fireEvent.lostPointerCapture(target, { pointerId: 1 })

    expect(session.begin).toHaveBeenCalledOnce()
    expect(session.commit).toHaveBeenCalledOnce()
    expect(session.cancel).not.toHaveBeenCalled()
  })

  it("cancels an unexpected loss of pointer capture", () => {
    const { session, target } = setup()
    fireEvent.pointerDown(target, { button: 0, pointerId: 2 })
    fireEvent.lostPointerCapture(target, { pointerId: 2 })

    expect(session.cancel).toHaveBeenCalledOnce()
    expect(session.commit).not.toHaveBeenCalled()
  })
})
