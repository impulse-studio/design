import { describe, expect, it } from "vitest"
import { previewMessageSchema } from "@/validators/sites/preview"

describe("site preview bridge", () => {
  it("accepts the visible JSX inventory sent by the preview", () => {
    const result = previewMessageSchema.safeParse({
      source: "digit-site",
      token: "preview-token",
      revision: 4,
      type: "inventory",
      elements: [
        { id: "ds-home-1", count: 3 },
        { id: "ds-home-2", count: 1 },
      ],
    })

    expect(result.success).toBe(true)
  })

  it("rejects invalid occurrence counts in the preview inventory", () => {
    const result = previewMessageSchema.safeParse({
      source: "digit-site",
      token: "preview-token",
      revision: 4,
      type: "inventory",
      elements: [{ id: "ds-home-1", count: 0 }],
    })

    expect(result.success).toBe(false)
  })
})
