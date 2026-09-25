import type { ChatCallbacks } from "@/features/chat/types"
import type { ChatBlock } from "@/validators/chat/messages"
import { ThinkingReasoning } from "@/components/shared/ThinkingReasoning"
import { AgentActivity } from "@/components/shared/agent-activity/AgentActivity"
import { TodoList } from "@/components/shared/todo-list/TodoList"
import { ApprovalCard } from "@/components/shared/approval/ApprovalCard"
import { ToolApproval } from "@/components/shared/tool-approval/ToolApproval"
import { FileDiff } from "@/components/shared/FileDiff"
import { ImageGeneration } from "@/components/shared/image-generation/ImageGeneration"
import { InlineCitations } from "@/components/shared/InlineCitations"
import { ChatQuestions } from "./ChatQuestions"
import { ChatAttachments } from "./ChatAttachments"

export function ChatMessageBlock({
  block,
  messageId,
  interactive,
  callbacks,
}: {
  block: ChatBlock
  messageId: string
  interactive: boolean
  callbacks: ChatCallbacks
}) {
  switch (block.type) {
    case "thinking":
      return <ThinkingReasoning active={block.active} lines={block.lines} />
    case "questions":
      return (
        <ChatQuestions
          block={block}
          disabled={!interactive}
          onChange={(answers, current) =>
            callbacks.onAnswer?.(messageId, answers, current)
          }
          onSubmit={() => callbacks.onSubmitAnswers?.(messageId)}
        />
      )
    case "approval":
      return (
        <ApprovalCard
          title="Valider la proposition"
          description={
            <span className="whitespace-pre-wrap">{block.description}</span>
          }
          status={block.status}
          approveLabel="Valider le plan"
          onApprove={
            interactive ? () => callbacks.onApprove?.(messageId) : undefined
          }
          onReject={
            interactive ? () => callbacks.onReject?.(messageId) : undefined
          }
          onRequestChanges={
            interactive
              ? () => callbacks.onRequestChanges?.(messageId)
              : undefined
          }
        />
      )
    case "tool":
      return (
        <ToolApproval
          tool="Aperçu local"
          title="Simuler les modifications ?"
          description="Cette action prépare un aperçu. Le canvas reste intact."
          status={block.status}
          parameters={[
            { id: "target", label: "Contexte", value: block.target },
          ]}
          onApprove={
            interactive
              ? () => callbacks.onToolDecision?.(messageId, true)
              : undefined
          }
          onDeny={
            interactive
              ? () => callbacks.onToolDecision?.(messageId, false)
              : undefined
          }
        />
      )
    case "activity":
      return (
        <AgentActivity
          items={block.steps.map((step) => ({ ...step, type: "step" }))}
          status={block.active ? "working" : "complete"}
          maxHeight={132}
          activeLabel="Préparation de l’aperçu…"
          summary="Activité de la démonstration"
        />
      )
    case "tasks":
      return (
        <TodoList
          items={block.tasks.map(({ label, ...task }) => ({
            ...task,
            title: label,
          }))}
          title="Plan de travail"
        />
      )
    case "attachments":
      return <ChatAttachments items={block.items} />
    case "sources":
      return (
        <InlineCitations
          text={block.text}
          refs={block.refs.filter((ref) => /^https?:\/\//i.test(ref.url))}
        />
      )
    case "diff":
      return <FileDiff file={block.file} rows={block.rows} />
    case "image":
      return (
        <ImageGeneration
          status={block.status}
          prompt={block.prompt}
          label={block.prompt}
          size="fluid"
          interactive={false}
          statusText={
            block.status === "complete"
              ? "Illustration de démonstration"
              : undefined
          }
        >
          <img
            src="/examples/generated-landscape.svg"
            alt="Illustration de démonstration : un lac et des montagnes"
          />
        </ImageGeneration>
      )
  }
}
