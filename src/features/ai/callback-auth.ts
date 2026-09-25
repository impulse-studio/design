import { v4 as uuid } from "uuid"
import { createHmac, timingSafeEqual } from "node:crypto"
import {
  callbackRequestSchema,
  callbackResponseSchemas,
} from "@/validators/ai/callback"
import type {
  CallbackAction,
  CallbackPayload,
  CallbackResponses,
} from "@/validators/ai/callback"

const secret = () => {
  const value = process.env.AI_CALLBACK_SECRET
  if (!value || value.length < 32)
    throw new Error("AI callback secret unavailable")
  return value
}
const digest = (timestamp: string, body: string) =>
  createHmac("sha256", secret()).update(`${timestamp}.${body}`).digest("hex")
export const signCallback = (body: string, timestamp = String(Date.now())) => ({
  "content-type": "application/json",
  "x-ai-timestamp": timestamp,
  "x-ai-signature": digest(timestamp, body),
})
export const verifyCallback = (request: Request, body: string) => {
  const timestamp = request.headers.get("x-ai-timestamp") ?? ""
  const signature = request.headers.get("x-ai-signature") ?? ""
  if (
    !/^\d+$/.test(timestamp) ||
    Math.abs(Date.now() - Number(timestamp)) > 60_000 ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false
  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(digest(timestamp, body), "hex")
  )
}
/** Bodies are never logged; failures expose no upstream response or credential. */
export const workerCallback = async <TAction extends CallbackAction>(
  chatId: string,
  action: TAction,
  data: CallbackPayload<TAction> = {} as CallbackPayload<TAction>
): Promise<CallbackResponses[TAction]> => {
  const base = new URL(process.env.AI_STUDIO_URL ?? "")
  if (
    base.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(base.hostname)
  )
    throw new Error("HTTPS callback required")
  const request = callbackRequestSchema.parse({
    chatId,
    action,
    eventId: uuid(),
    ...data,
  })
  const body = JSON.stringify(request)
  const response = await fetch(new URL("/api/ai/callback", base), {
    method: "POST",
    headers: signCallback(body),
    body,
    signal: AbortSignal.timeout(15_000),
    redirect: "error",
  })
  if (!response.ok) throw new Error("Studio callback unavailable")
  return callbackResponseSchemas[action].parse(
    await response.json()
  ) as CallbackResponses[TAction]
}
