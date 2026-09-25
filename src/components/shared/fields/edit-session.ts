import { createContext, useContext } from "react"

/**
 * Groups the successive changes of one gesture (typing, scrubbing, dragging a
 * color) into a single undo entry. Fields work without a provider: every
 * change is then applied immediately.
 */
export type EditSession = {
  begin: () => void
  commit: () => void
  cancel: () => void
}

const noop = () => {}

export const EditSessionContext = createContext<EditSession>({
  begin: noop,
  commit: noop,
  cancel: noop,
})

export const useEditSession = () => useContext(EditSessionContext)
