export type LibraryFailureKind =
  "not_found" | "forbidden" | "invalid" | "conflict"

export class LibraryFailure extends Error {
  constructor(
    readonly kind: LibraryFailureKind,
    message: string
  ) {
    super(message)
  }
}
