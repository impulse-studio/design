import { describe, expect, it } from "vitest"
import { v4 as uuid, validate, version } from "uuid"
import { inviteMemberSchema } from "./teams"
import { mockupLinksFormSchema, mockupLinksSchema } from "./mockups"
import { createSiteSchema } from "./sites/requests"
import { createSiteFormSchema } from "./sites/forms"
import { importLibrarySchema } from "./libraries/requests"
import { filePathSchema } from "./sites/paths"
import { createQuestionnaireAnswerSchema } from "./chat/questionnaire"
import { uuidSchema } from "./identifiers"

describe("contrats partagés entre formulaires et API", () => {
  it("préserve les transformations des adresses et des liens", () => {
    expect(
      inviteMemberSchema.parse({
        email: "  TEST@DIGITEVENT.COM  ",
        role: "member",
      }).email
    ).toBe("test@digitevent.com")
    const links = mockupLinksFormSchema.parse({
      notionUrl: "  ",
      githubUrl: " https://github.com/example/project ",
    })
    expect(links).toEqual({
      notionUrl: null,
      githubUrl: "https://github.com/example/project",
    })
    expect(mockupLinksSchema.parse(links)).toEqual(links)
    expect(
      mockupLinksSchema.safeParse({
        notionUrl: "javascript:alert(1)",
        githubUrl: null,
      }).success
    ).toBe(false)
  })
  it("conserve la différence entre les valeurs par défaut API et les champs requis du formulaire", () => {
    expect(createSiteSchema.parse({ name: "  Projet  " })).toEqual({
      name: "Projet",
      kind: "react-vite",
    })
    expect(createSiteFormSchema.safeParse({ name: "Projet" }).success).toBe(
      false
    )
    expect(
      createSiteFormSchema.parse({ name: " Projet ", kind: "vue-vite" })
    ).toEqual({ name: "Projet", kind: "vue-vite" })
  })
  it("conserve les limites et la normalisation d’une publication de bibliothèque", () => {
    const parsed = importLibrarySchema.parse({
      name: "  UI  ",
      payload: { framework: "react-vite", files: {} },
    })
    expect(parsed).toMatchObject({
      name: "UI",
      expectedVersion: 0,
      payload: { assets: {}, dependencies: {}, components: [] },
    })
    expect(
      importLibrarySchema.safeParse({ ...parsed, extra: true }).success
    ).toBe(false)
    for (const path of ["../secret", ".env", "node_modules/file.ts"])
      expect(filePathSchema.safeParse(path).success).toBe(false)
  })
  it("conserve les règles de réponse unique et les options désactivées", () => {
    const answer = createQuestionnaireAnswerSchema({
      id: "choice",
      required: true,
      multiple: false,
      allowCustom: true,
      options: [{ value: "a" }, { value: "b", disabled: true }],
    })
    expect(answer.safeParse({ selected: [], custom: " " }).success).toBe(false)
    expect(answer.safeParse({ selected: ["b"], custom: "" }).success).toBe(
      false
    )
    expect(answer.safeParse({ selected: ["a"], custom: "texte" }).success).toBe(
      false
    )
    expect(answer.safeParse({ selected: [], custom: "texte" }).success).toBe(
      true
    )
  })
  it("accepte les UUID v4 du package dans les contrats existants", () => {
    const id = uuid()
    expect(validate(id)).toBe(true)
    expect(version(id)).toBe(4)
    expect(uuidSchema.parse(id)).toBe(id)
  })
})
