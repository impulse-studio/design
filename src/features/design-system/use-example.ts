import { useEffect, useState } from "react"
import type { CatalogEntry, ExampleModule } from "./types"

const modules = new Map<string, Promise<ExampleModule>>()
export const useExample = (entry: CatalogEntry) => {
  const [result, setResult] = useState<{
    module: ExampleModule | null
    error: boolean
  }>({ module: null, error: false })
  useEffect(() => {
    let active = true
    setResult({ module: null, error: false })
    if (!modules.has(entry.id)) modules.set(entry.id, entry.load())
    modules
      .get(entry.id)!
      .then((module) => {
        if (active) setResult({ module, error: false })
      })
      .catch(() => {
        modules.delete(entry.id)
        if (active) setResult({ module: null, error: true })
      })
    return () => {
      active = false
    }
  }, [entry])
  return result
}
