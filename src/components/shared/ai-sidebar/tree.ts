import { findResource, moveResource, renameResource } from "./resources"
import type { SidebarResource, SidebarResourceMove } from "./types"

type Change =
  | { type: "move"; move: SidebarResourceMove }
  | { type: "rename"; id: string; label: string }
type PendingChange = { change: Change; settled: boolean; failed: boolean }
const apply = (items: SidebarResource[], change: Change) =>
  change.type === "move"
    ? (moveResource(items, change.move) ?? items)
    : findResource(items, change.id)
      ? renameResource(items, change.id, change.label)
      : items

/** Replays later edits after a rejected optimistic change; external trees start a new epoch. */
export const createResourceTree = (initial: SidebarResource[]) => {
  let base = initial,
    current = initial
  let changes: PendingChange[] = []
  const listeners = new Set<() => void>()
  const publish = () => {
    current = changes.reduce(
      (items, entry) => (entry.failed ? items : apply(items, entry.change)),
      base
    )
    for (const listener of listeners) listener()
  }
  return {
    get: () => current,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    replace: (items: SidebarResource[]) => {
      if (items === current) return
      base = items
      changes = []
      publish()
    },
    change: async (change: Change, persist: () => void | Promise<void>) => {
      const next = apply(current, change)
      if (next === current) return false
      const entry: PendingChange = { change, settled: false, failed: false }
      changes.push(entry)
      publish()
      try {
        await persist()
        return true
      } catch (error) {
        entry.failed = true
        throw error
      } finally {
        entry.settled = true
        if (changes.includes(entry)) {
          while (changes[0]?.settled) {
            const first = changes.shift()!
            if (!first.failed) base = apply(base, first.change)
          }
          publish()
        }
      }
    },
  }
}
