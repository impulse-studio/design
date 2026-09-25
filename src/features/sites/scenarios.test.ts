import { describe, expect, it } from "vitest"
import { strFromU8, unzipSync } from "fflate"
import { createSiteDocument } from "./template"
import { applySiteProposal } from "./source"
import { exportSite } from "./export"
import { readScenarios, scenarioDocument, scenariosPath } from "./scenarios"

const config = {
  defaultId: "lucien",
  scenarios: [
    {
      id: "lucien",
      name: "Lucien — 20 contacts segmentés",
      path: "/",
      data: {
        contacts: Array.from({ length: 20 }, (_, id) => ({
          id,
          segment: "Clients",
        })),
      },
    },
    {
      id: "lea",
      name: "Léa — 3 contacts principaux",
      path: "/",
      data: { contacts: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    },
  ],
}
const createDoc = () =>
  applySiteProposal(createSiteDocument(), {
    summary: "Scénarios",
    operations: [
      {
        type: "writeFile",
        path: scenariosPath,
        content: JSON.stringify(config),
      },
    ],
  })

describe("mockup scenarios", () => {
  it("keeps legacy projects usable without inventing scenarios", () => {
    const doc = createSiteDocument()
    expect(readScenarios(doc)).toBeNull()
    expect(scenarioDocument(doc, "lea")).toBe(doc)
  })
  it("switches data without changing the saved document and exports the chosen state", () => {
    const doc = createDoc()
    const selected = scenarioDocument(doc, "lea")
    const result = readScenarios(selected)!
    expect(result.defaultId).toBe("lea")
    expect(
      result.scenarios.find((item) => item.id === result.defaultId)?.data
        .contacts
    ).toHaveLength(3)
    expect(readScenarios(doc)?.defaultId).toBe("lucien")
    expect(scenarioDocument(doc, "unknown")).toBe(doc)
    const exported = JSON.parse(
      strFromU8(unzipSync(exportSite(selected))[scenariosPath])
    )
    expect(exported.defaultId).toBe("lea")
    expect(exported.scenarios).toHaveLength(2)
  })
  it("rejects invalid scenarios before applying a proposal", () => {
    for (const invalid of [
      { ...config, defaultId: "missing" },
      { ...config, scenarios: [config.scenarios[0], config.scenarios[0]] },
    ]) {
      expect(() =>
        applySiteProposal(createSiteDocument(), {
          summary: "Invalid scenarios",
          operations: [
            {
              type: "writeFile",
              path: scenariosPath,
              content: JSON.stringify(invalid),
            },
          ],
        })
      ).toThrow()
    }
  })
})
