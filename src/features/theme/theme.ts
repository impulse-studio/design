import { createContext, useContext } from "react"

export type ThemeMode = "light" | "dark"
export const THEME_COOKIE = "digit-ui-theme"
export const parseTheme = (value: unknown): ThemeMode =>
  value === "dark" ? "dark" : "light"
export const ThemeContext = createContext<{
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
} | null>(null)
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("ThemeProvider is required")
  return context
}
