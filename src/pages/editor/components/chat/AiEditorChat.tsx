import { findNode, nodeLabel } from "@digit-ai-studio/shared"
import { RiAddLine, RiCloseLine } from "@remixicon/react"
import { useAiSession } from "@/features/ai/context"
import { useEditor, useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { ChatConversation } from "@/components/shared/chat/ChatConversation"
import { PromptInput } from "@/components/shared/PromptInput"
import { AiUsageDialog } from "@/components/ai/AiUsageDialog"
import { AiProviderLogo } from "@/components/ai/AiProviderLogo"
import { MockupProposalCard } from "@/components/ai/MockupProposalCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AiEditorChat({
  mockupId,
  onDemo,
}: {
  mockupId: string
  onDemo: () => void
}) {
  const chat = useAiSession(),
    editor = useEditor()
  const state = useEditorState((value) => value)
  const active =
    chat.snapshot.run?.status === "running" ||
    chat.snapshot.run?.status === "queued"
  const readOnly = editor.readOnly || state.rightTab === "inspect"
  const selection = state.selectedIds
    .filter((id) => !chat.ignored.includes(id))
    .flatMap((id) => {
      const node = findNode(framesOf(state.doc), id)?.node
      return node ? [{ id, label: nodeLabel(node) }] : []
    })
  return (
    <div className="editor-chat flex flex-col h-full min-h-0 min-w-0 [container-type:inline-size] [&_:is(button,_input,_textarea,_a):focus-visible]:[outline-offset:3px] [@media(pointer:coarse)]:[&_button]:min-h-[44px] [@media(pointer:coarse)]:[&_textarea]:text-[16px] motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:[transition:none] motion-reduce:[&_*]:[scroll-behavior:auto] motion-reduce:[&_*::before]:animate-none motion-reduce:[&_*::before]:[transition:none] motion-reduce:[&_*::before]:[scroll-behavior:auto] motion-reduce:[&_*::after]:animate-none motion-reduce:[&_*::after]:[transition:none] motion-reduce:[&_*::after]:[scroll-behavior:auto]" data-mockup-id={mockupId}>
      <div className="flex items-center justify-between gap-1 border-b p-2">
        <AiUsageDialog usage={chat.snapshot.usage} />
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Nouvelle conversation"
          disabled={chat.busy || active}
          onClick={() => void chat.newConversation()}
        >
          <RiAddLine />
        </Button>
      </div>
      {chat.snapshot.conversations.length > 1 && (
        <div className="px-3 pt-2">
          <Select
            value={chat.snapshot.conversationId}
            onValueChange={(value) => {
              if (value) chat.setConversationId(value)
            }}
            disabled={chat.busy}
          >
            <SelectTrigger
              className="w-full"
              aria-label="Historique des conversations"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {chat.snapshot.conversations.map((conversation) => (
                  <SelectItem key={conversation.id} value={conversation.id}>
                    {conversation.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <ChatConversation
        messages={chat.snapshot.messages}
        streaming={chat.snapshot.run?.status === "running"}
        activeMessageId={
          active ? `${chat.snapshot.run?.id}:assistant` : undefined
        }
        canRetry={false}
        renderAfterMessage={(message) =>
          message.role === "assistant" &&
          chat.snapshot.proposals
            .filter((proposal) => `${proposal.runId}:assistant` === message.id)
            .map((proposal) => (
              <MockupProposalCard
                key={proposal.id}
                proposal={proposal}
                busy={chat.busy || active}
                readOnly={readOnly}
                saving={chat.pendingApply === proposal.id}
                onApply={() => chat.apply(proposal)}
                onReject={() => chat.reject(proposal)}
              />
            ))
        }
        emptyState={
          <Empty className="border-0 px-2">
            <EmptyHeader>
              <EmptyMedia>
                <AiProviderLogo
                  provider={
                    chat.model.startsWith("anthropic:") ? "anthropic" : "openai"
                  }
                  className="size-10"
                />
              </EmptyMedia>
              <EmptyTitle>De l’idée à l’interface.</EmptyTitle>
              <EmptyDescription>
                {chat.connection?.available
                  ? "Décrivez une page ou affinez votre sélection. Vous validez chaque modification."
                  : (chat.connection?.error ??
                    "Le chat IA est en cours de configuration.")}
              </EmptyDescription>
            </EmptyHeader>
            <Button variant="ghost" size="sm" onClick={onDemo}>
              Explorer la démonstration
            </Button>
          </Empty>
        }
      />
      <div className="flex flex-col gap-2 border-t p-3">
        {(chat.error || chat.snapshot.run?.error) && (
          <Alert variant="destructive">
            <AlertDescription>
              {chat.error ?? chat.snapshot.run?.error}
            </AlertDescription>
          </Alert>
        )}
        {(chat.reconnecting || chat.snapshot.run?.status === "queued") && (
          <p role="status" className="text-xs text-muted-foreground">
            {chat.reconnecting
              ? "Reconnexion au chat…"
              : "En attente d’une place sur le serveur…"}
          </p>
        )}
        {selection.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selection.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="max-w-full gap-1"
              >
                <span className="truncate">{item.label}</span>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label={`Retirer ${item.label} du contexte`}
                  onClick={() => chat.setIgnored([...chat.ignored, item.id])}
                >
                  <RiCloseLine />
                </Button>
              </Badge>
            ))}
          </div>
        )}
        <PromptInput
          value={chat.draft}
          onValueChange={chat.setDraft}
          model={chat.model}
          onModelChange={chat.setModel}
          models={
            chat.connection?.models.map((model) => ({
              value: model.model,
              label: model.displayName,
              icon: <AiProviderLogo provider={model.provider} />,
            })) ?? []
          }
          placeholder="Décrivez votre interface…"
          onSubmit={chat.send}
          submitDisabled={
            !chat.connection?.available ||
            !chat.model ||
            chat.busy ||
            state.transaction !== null
          }
          loading={active}
          onStop={() => void chat.stop()}
        />
        <p className="text-xs text-muted-foreground">
          API du studio · changements après validation
        </p>
      </div>
    </div>
  )
}
