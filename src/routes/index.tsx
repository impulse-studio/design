import { createFileRoute, Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({ component: Home })

// Placeholder until the Recents page (M2).
function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">Digit AI Studio</h1>
      <Button render={<Link to="/m/$mockupId" params={{ mockupId: "demo" }} />}>Ouvrir la maquette de démo</Button>
    </main>
  )
}
