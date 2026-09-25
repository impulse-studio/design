import { expect, it } from "vitest"
import { render, fireEvent, screen } from "@testing-library/react"
import { DataTableExample } from "@/components/design-system/examples/DataTableExample"

it("filtre, trie et pagine les données sans perdre la cohérence de la page", () => {
  render(<DataTableExample />)
  expect(screen.getByText("Page 1 sur 2")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Suivant" }))
  expect(screen.getByText("Paramètres")).toBeTruthy()
  expect(screen.getByText("Page 2 sur 2")).toBeTruthy()
  fireEvent.change(
    screen.getByRole("searchbox", { name: "Filtrer les lignes" }),
    { target: { value: "Inscription" } }
  )
  expect(screen.getByText("Page 1 sur 1")).toBeTruthy()
  expect(screen.getByText("Inscription")).toBeTruthy()
  fireEvent.change(
    screen.getByRole("searchbox", { name: "Filtrer les lignes" }),
    { target: { value: "zzz" } }
  )
  expect(screen.getByText("Aucun résultat.")).toBeTruthy()
  fireEvent.change(
    screen.getByRole("searchbox", { name: "Filtrer les lignes" }),
    { target: { value: "" } }
  )
  fireEvent.click(screen.getByRole("button", { name: "Projet" }))
  expect(
    screen
      .getByRole("columnheader", { name: "Projet" })
      .getAttribute("aria-sort")
  ).toBe("ascending")
  expect(screen.getAllByRole("row")[2].textContent).toContain(
    "Espace organisateur"
  )
})
