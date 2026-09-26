import type { MockupDoc } from "@digit-ai-studio/shared"
import { validateComposition } from "@/features/mockups/catalog"
import { applyOperations } from "@/features/mockups/operations"
import { proposalInputSchema } from "@/validators/mockups/operations"
import type { ProposalInput } from "@/validators/mockups/operations"
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
  const doc = validateComposition(
    source,
    applyOperations(source, input, library)
  )
  return { input, doc }
}
