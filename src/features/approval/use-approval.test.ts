// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useApproval } from "./use-approval"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("approval", () => {
  it("approves once when manual approval races the deadline", async () => {
    vi.useFakeTimers()
    const onApprove = vi.fn()
    const deadline = Date.now() + 1000
    const { result } = renderHook(() => useApproval(onApprove, deadline))
    await act(async () => {
      await result.current.approve()
      vi.advanceTimersByTime(2000)
    })
    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe("approved")
  })
  it("automatically approves at the deadline", async () => {
    vi.useFakeTimers()
    const onApprove = vi.fn()
    const deadline = Date.now() + 2000
    const { result } = renderHook(() => useApproval(onApprove, deadline))
    expect(result.current.remaining).toBe(2)
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })
    expect(onApprove).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe("approved")
  })
  it("allows retry after failure without automatically retrying", async () => {
    vi.useFakeTimers()
    const onApprove = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(undefined)
    const deadline = Date.now() + 1000
    const { result } = renderHook(() => useApproval(onApprove, deadline))
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.status).toBe("error")
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    expect(onApprove).toHaveBeenCalledTimes(1)
    await act(async () => {
      await result.current.approve()
    })
    expect(result.current.status).toBe("approved")
  })
  it("disables approval and cleans up timers on unmount", async () => {
    vi.useFakeTimers()
    const onApprove = vi.fn()
    const deadline = Date.now() + 1000
    const { result, unmount } = renderHook(() =>
      useApproval(onApprove, deadline, true)
    )
    await act(async () => {
      await result.current.approve()
      vi.advanceTimersByTime(2000)
    })
    expect(onApprove).not.toHaveBeenCalled()
    unmount()
    const active = renderHook(() => useApproval(onApprove, Date.now() + 1000))
    active.unmount()
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })
    expect(onApprove).not.toHaveBeenCalled()
  })
})
