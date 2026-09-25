export type SiteFailureKind = "not_found" | "forbidden" | "conflict" | "invalid"

export class SiteFailure extends Error {
  constructor(
    readonly kind: SiteFailureKind,
    message: string
  ) {
    super(message)
  }
}
