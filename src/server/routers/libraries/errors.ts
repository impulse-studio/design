import { LibraryFailure } from "@/features/libraries/errors"

export const mapConnectionFailure = (
  error: unknown,
  errors: {
    NOT_FOUND: (options: { message: string }) => unknown
    FORBIDDEN: (options: { message: string }) => unknown
    CONFLICT: (options: { message: string }) => unknown
  }
) => {
  if (!(error instanceof LibraryFailure)) throw error
  if (error.kind === "not_found")
    throw errors.NOT_FOUND({ message: error.message })
  if (error.kind === "forbidden")
    throw errors.FORBIDDEN({ message: error.message })
  throw errors.CONFLICT({ message: error.message })
}
