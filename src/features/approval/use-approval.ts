import { useCallback, useEffect, useRef, useState } from "react"

export const useApproval = (
  onApprove: () => void | Promise<void>,
  autoApproveAt?: number,
  disabled = false
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "approved" | "error"
  >("idle")
  const [remaining, setRemaining] = useState<number | null>(null)
  const locked = useRef(false)
  const approve = useCallback(async () => {
    if (locked.current || disabled) return
    locked.current = true
    setStatus("pending")
    try {
      await onApprove()
      setStatus("approved")
    } catch {
      locked.current = false
      setStatus("error")
    }
  }, [onApprove, disabled])

  useEffect(() => {
    if (
      autoApproveAt === undefined ||
      !Number.isFinite(autoApproveAt) ||
      disabled ||
      status !== "idle"
    ) {
      setRemaining(null)
      return
    }
    const tick = () => {
      const seconds = Math.max(
        0,
        Math.ceil((autoApproveAt - Date.now()) / 1000)
      )
      setRemaining(seconds)
      if (seconds === 0) void approve()
    }
    tick()
    const timer = setInterval(tick, 250)
    return () => clearInterval(timer)
  }, [autoApproveAt, disabled, status, approve])
  return { status, remaining, approve }
}
