export type AiFailureKind =
  "not_found" | "forbidden" | "conflict" | "limit" | "unavailable"

export class AiFailure extends Error {
  constructor(
    readonly kind: AiFailureKind,
    message: string
  ) {
    super(message)
  }
}
