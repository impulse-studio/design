import { describe, expect, it } from "vitest"
import { AiFailure } from "./errors"

describe("résultats métier IA", () => {
  it("conserve sa classification quand le message change", () => {
    const first = new AiFailure("conflict", "Premier texte")
    const second = new AiFailure("conflict", "Autre texte")
    expect(first.kind).toBe(second.kind)
  })
})
