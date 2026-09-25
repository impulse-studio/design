import { HeadContent, Scripts, useRouteContext } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { InterfaceMotion } from "./InterfaceMotion"
import { DialRoot } from "dialkit"

export function RootDocument({ children }: { children: ReactNode }) {
  const { theme } = useRouteContext({ from: "__root__" })
  return (
    <html lang="fr" className={theme === "dark" ? "dark" : undefined}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider initialTheme={theme}>
          <InterfaceMotion>
            <TooltipProvider>
              <Toaster>{children}</Toaster>
            </TooltipProvider>
          </InterfaceMotion>
        </ThemeProvider>
        {import.meta.env.DEV && <DialRoot position="bottom-right" />}
        <Scripts />
      </body>
    </html>
  )
}
