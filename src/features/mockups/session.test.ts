import { describe, expect, it } from "vitest"
import { mockupSessionKey } from "./use-session"

const record = {
  id: "mockup",
  canEdit: true,
  revision: 3,
}

describe("mockup session identity", () => {
  it("keeps an editable session mounted across remote revisions", () => {
    expect(mockupSessionKey(record)).toBe(
      mockupSessionKey({ ...record, revision: 4 })
    )
  })

  it("remounts a read-only session for revisions and permission changes", () => {
    const readOnly = { ...record, canEdit: false }
    expect(mockupSessionKey(readOnly)).not.toBe(
      mockupSessionKey({ ...readOnly, revision: 4 })
    )
    expect(mockupSessionKey(record)).not.toBe(mockupSessionKey(readOnly))
  })
})
