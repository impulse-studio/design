import type { MockupDoc } from "@digit-ai-studio/shared"
import { validateAiComposition } from "@/features/ai/catalog"
import { applyOperations } from "@/features/ai/operations"
import { proposalInputSchema } from "@/validators/ai/operations"
import type { ProposalInput } from "@/validators/ai/operations"
import { library } from "@/features/editor/library"

export type PreparedMockupProposal = {
  input: ProposalInput
  doc: MockupDoc
}

export const prepareMockupProposal = (
  source: MockupDoc,
  raw: unknown
): PreparedMockupProposal => {
  const input = proposalInputSchema.parse(raw)
  const doc = validateAiComposition(
    source,
    applyOperations(source, input, library)
  )
  return { input, doc }
}
