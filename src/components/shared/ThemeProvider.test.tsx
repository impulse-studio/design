import { describe, expect, it } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeProvider } from "./ThemeProvider"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { parseTheme, THEME_COOKIE } from "@/features/theme/theme"

describe("thème", () => {
  it("utilise le clair par défaut et accepte uniquement le sombre explicite", () => {
    expect([undefined, "system", "", null].map(parseTheme)).toEqual([
      "light",
      "light",
      "light",
      "light",
    ])
    expect(parseTheme("dark")).toBe("dark")
  })
  it("synchronise le DOM, le bouton et le cookie lu par le serveur", () => {
    render(
      <ThemeProvider initialTheme="light">
        <TooltipProvider>
          <ThemeToggle />
        </TooltipProvider>
      </ThemeProvider>
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Passer au thème sombre" })
    )
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(document.cookie).toContain(THEME_COOKIE + "=dark")
    fireEvent.click(
      screen.getByRole("button", { name: "Passer au thème clair" })
    )
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    expect(document.cookie).toContain(THEME_COOKIE + "=light")
  })
})
