import type { ChatAttachment } from "./types"

export const CHAT_FILE_ACCEPT = ".png,.jpg,.jpeg,.webp,.pdf,.txt,.md"
export const MAX_CHAT_FILES = 5
export const MAX_CHAT_FILE_SIZE = 10 * 1024 * 1024
const mimeTypes: Partial<Record<string, string[]>> = {
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  webp: ["image/webp"],
  pdf: ["application/pdf"],
  txt: ["text/plain"],
  md: ["text/markdown", "text/plain", "text/x-markdown"],
}
export const validateChatFile = (file: File): string | null => {
  const extension = file.name.split(".").at(-1)?.toLowerCase() ?? ""
  const allowed = mimeTypes[extension]
  if (!allowed || (file.type && !allowed.includes(file.type)))
    return `${file.name} : format non accepté.`
  if (file.size > MAX_CHAT_FILE_SIZE)
    return `${file.name} : la limite est de 10 Mo.`
  return null
}
export const attachmentIsImage = (item: ChatAttachment) =>
  /\.(png|jpe?g|webp)$/i.test(item.name)
export const attachmentSize = (size: number) =>
  size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} Ko`
    : `${(size / 1024 / 1024).toFixed(1)} Mo`
