import { useRouteContext } from "@tanstack/react-router"

export const useOrpc = () => useRouteContext({ from: "__root__" }).orpc
