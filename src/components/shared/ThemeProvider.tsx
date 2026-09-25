import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { ThemeContext, THEME_COOKIE } from "@/features/theme/theme"
import type { ThemeMode } from "@/features/theme/theme"

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: ThemeMode
  children: ReactNode
}) {
  const [theme, updateTheme] = useState(initialTheme)
  const setTheme = useCallback((next: ThemeMode) => {
    document.documentElement.dataset.themeChanging = ""
    document.documentElement.classList.toggle("dark", next === "dark")
    document.cookie = `${THEME_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`
    updateTheme(next)
    // Commit the new colors while transitions are suppressed.
    void document.documentElement.offsetHeight
    requestAnimationFrame(() => {
      delete document.documentElement.dataset.themeChanging
    })
  }, [])
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
