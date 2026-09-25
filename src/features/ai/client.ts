import { canonicalDocument } from "./operations"
import type { AiAction } from "./actions"

export const hashDocument = async (doc: unknown) => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalDocument(doc))
  )
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
export const aiRequest = async <T>(
  path: string,
  body?: AiAction,
  signal?: AbortSignal
): Promise<T> => {
  const response = await fetch(`/api/ai/${path}`, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    cache: "no-store",
    signal,
    ...(body
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
  })
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new Error(result?.error ?? "Le service IA est indisponible.")
  }
  return response.json() as Promise<T>
}
