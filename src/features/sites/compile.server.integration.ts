// @vitest-environment node
import { describe, expect, it } from "vitest"
import { createSiteDocument } from "./template"
import { validateSiteBuild } from "./compile.server"

describe("server site compilation", () => {
  it("compiles the template and rejects missing imports without executing it", async () => {
    const doc = createSiteDocument()
    await expect(validateSiteBuild(doc)).resolves.toBeUndefined()
    doc.files["src/main.tsx"] = "import './missing-file'"
    await expect(validateSiteBuild(doc)).rejects.toThrow("Import indisponible")
  }, 30000)
})
