import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { IconButton } from "@/components/shared/IconButton"
import { useTheme } from "@/features/theme/theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const label =
    theme === "light" ? "Passer au thème sombre" : "Passer au thème clair"
  return (
    <IconButton
      label={label}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <RiSunLine /> : <RiMoonLine />}
    </IconButton>
  )
}
