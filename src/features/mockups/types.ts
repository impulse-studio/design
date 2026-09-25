import type { MockupDoc } from "@digit-ai-studio/shared"

import type { MockupStatus } from "./status"

export type MockupRecord = {
  id: string
  name: string
  notionUrl: string | null
  githubUrl: string | null
  status: MockupStatus
  doc: MockupDoc
  revision: number
  updatedAt: string
}
export type MockupSummary = Omit<MockupRecord, "doc">
export type SaveInput = {
  id: string
  name: string
  status: MockupStatus
  doc: MockupDoc
  expectedRevision: number
}
export type UpdateLinksInput = {
  id: string
  notionUrl: string | null
  githubUrl: string | null
}
export type SaveResult =
  | { status: "saved"; revision: number; updatedAt: string }
  | { status: "conflict"; revision: number }
