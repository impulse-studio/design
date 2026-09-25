import { useEffect, useRef, useState } from "react"
import { RiAttachmentLine, RiCloseLine, RiPlayListLine } from "@remixicon/react"
import { useEditorChat } from "@/features/chat/context"
import { isGenerating } from "@/features/chat/reducer"
import { CHAT_FILE_ACCEPT } from "@/features/chat/attachments"
import type { ChatContextItem, ChatScenario } from "@/features/chat/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PromptInput } from "@/components/shared/PromptInput"
import { ChatModelSettings } from "./ChatModelSettings"
import { ChatAttachments } from "./ChatAttachments"
import { ChatSuggestions } from "./ChatSuggestions"

export function ChatComposer({
  selection,
  onSend,
}: {
  selection: ChatContextItem[]
  onSend: (text: string, scenario?: ChatScenario) => void
}) {
  const { state, draft, dispatch, addFiles, storageError } = useEditorChat()
  const input = useRef<HTMLInputElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [scenariosOpen, setScenariosOpen] = useState(false)
  const context = selection.filter(
    (item) => !state.ignoredContext.includes(item.id)
  )
  const generating = isGenerating(state.run)
  const missingFiles = draft.attachments.some((item) => !item.blobUrl)
  useEffect(() => {
    if (state.focusRequest)
      root.current?.querySelector("textarea")?.focus({ preventScroll: true })
  }, [state.focusRequest])
  return (
    <div
      ref={root}
      className="chat-composer flex flex-none min-w-0 flex-col gap-2 p-2.5 border-t border-border bg-background"
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files")) event.preventDefault()
      }}
      onDrop={(event) => {
        if (event.dataTransfer.files.length) {
          event.preventDefault()
          addFiles(Array.from(event.dataTransfer.files))
        }
      }}
    >
      {state.notice && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-start gap-2">
            <span className="flex-1">{state.notice}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Fermer le message du chat"
              onClick={() => dispatch({ type: "notice", text: null })}
            >
              <RiCloseLine />
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {storageError && (
        <p role="status" className="text-xs text-muted-foreground">
          Stockage local indisponible. Le chat reste disponible pour cette
          session.
        </p>
      )}
      {!!context.length && (
        <div className="chat-context flex flex-wrap gap-1 max-h-[90px] overflow-y-auto [&_[data-slot=badge]]:min-w-0 [&_[data-slot=badge]]:font-normal" aria-label="Contexte du prochain message">
          {context.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="max-w-full gap-1"
            >
              <span className="truncate" title={item.label}>
                {item.label}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Retirer du contexte : ${item.label}`}
                onClick={() => dispatch({ type: "context", id: item.id })}
              >
                <RiCloseLine />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      {selection.some((item) => state.ignoredContext.includes(item.id)) && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() =>
            selection.forEach((item) => {
              if (state.ignoredContext.includes(item.id))
                dispatch({ type: "context", id: item.id })
            })
          }
        >
          Rétablir le contexte
        </Button>
      )}
      {!!draft.attachments.length && (
        <div className="chat-draft-attachments max-h-[154px] overflow-y-auto">
          <ChatAttachments
            items={draft.attachments}
            onRemove={(id) =>
              dispatch({
                type: "attachments",
                items: draft.attachments.filter((item) => item.id !== id),
              })
            }
          />
        </div>
      )}
      <ChatModelSettings
        model={state.model}
        effort={state.effort}
        disabled={!state.ready || !!state.run}
        onModelChange={(value) => dispatch({ type: "model", value })}
        onEffortChange={(value) => dispatch({ type: "effort", value })}
      />
      <input
        ref={input}
        type="file"
        hidden
        multiple
        accept={CHAT_FILE_ACCEPT}
        aria-label="Joindre des fichiers"
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []))
          event.target.value = ""
        }}
      />
      <PromptInput
        value={draft.text}
        onValueChange={(text) => dispatch({ type: "draft", text })}
        disabled={!state.ready}
        submitDisabled={!state.demo || !!state.run || missingFiles}
        allowEmpty={draft.attachments.length > 0 && !missingFiles}
        loading={generating}
        onStop={() => dispatch({ type: "stop" })}
        onSubmit={(text) => onSend(text)}
        aria-label="Message à l’assistant"
        placeholder={
          state.demo ? "Décrivez votre interface…" : "Préparez votre demande…"
        }
        onPaste={(event) => {
          if (event.clipboardData.files.length) {
            event.preventDefault()
            addFiles(Array.from(event.clipboardData.files))
          }
        }}
        actions={[
          {
            value: "attach",
            label: "Joindre un fichier",
            description: "5 fichiers · 10 Mo chacun",
            icon: <RiAttachmentLine />,
            disabled: !!state.run,
          },
        ]}
        onAction={() => input.current?.click()}
        leadingAction={
          state.demo && (
            <Popover open={scenariosOpen} onOpenChange={setScenariosOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={!!state.run}
                  />
                }
                aria-label="Scénarios de démonstration"
              >
                <RiPlayListLine />
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-64">
                <ChatSuggestions
                  hasSelection={context.length > 0}
                  onSelect={(scenario, prompt) => {
                    onSend(prompt, scenario)
                    setScenariosOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          )
        }
      />
      {state.run && !generating ? (
        <div className="chat-waiting flex items-center justify-between gap-1 text-[11px] leading-[1.5] text-muted-foreground">
          <span role="status">
            {state.run.phase === "questions"
              ? "Répondez aux questions dans le fil."
              : "Votre validation est attendue dans le fil."}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch({ type: "stop" })}
          >
            Annuler
          </Button>
        </div>
      ) : (
        <p className="chat-composer-note px-0.75 text-[10px] leading-[1.5] text-muted-foreground">
          {state.demo
            ? "Démonstration locale · aucune modification du canvas"
            : "Brouillon conservé · IA non connectée"}
        </p>
      )}
    </div>
  )
}
