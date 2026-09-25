import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { OptionSelect } from "@/components/shared/OptionSelect"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  MessageScrollerProvider,
  MessageScrollerContent,
  MessageScroller,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Spinner } from "@/components/ui/spinner"
import type { useSiteChat } from "@/features/sites/use-chat"

const promptSchema = z.object({
  prompt: z.string().trim().min(1, "Décrivez votre modification.").max(20000),
})
export function SiteChat({
  chat,
  disabled,
  selection,
  error,
}: {
  chat: ReturnType<typeof useSiteChat>
  disabled: boolean
  selection: string | null
  error: string | null
}) {
  const form = useForm({
    defaultValues: { prompt: "" },
    validators: { onSubmit: promptSchema },
    onSubmit: async ({ value }) => {
      const { prompt } = promptSchema.parse(value)
      if (await chat.send(prompt)) form.reset()
    },
  })
  return (
    <aside className="flex w-full min-w-0 flex-1 flex-col border-0">
      <div className="site-panel-heading py-[18px] px-4 border-b border-border [&_h2]:text-[13px] [&_h2]:font-semibold [&_p]:text-[11px] [&_p]:text-muted-foreground [&_p]:mt-1">
        <h2>Créons votre site</h2>
        <p>React + Vite · style Digitevent</p>
      </div>
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent className="gap-4">
              {!chat.snapshot?.messages.length && (
                <p className="text-sm text-muted-foreground">
                  Décrivez votre site, ses pages et ses interactions. Vous
                  pourrez ensuite affiner les détails directement dans l’aperçu.
                </p>
              )}
              {chat.snapshot?.messages.map((message) => (
                <Message
                  key={message.id}
                  align={message.role === "user" ? "end" : "start"}
                >
                  <MessageContent>
                    <Bubble
                      variant={message.role === "user" ? "secondary" : "ghost"}
                    >
                      <BubbleContent className="whitespace-pre-wrap">
                        {message.text ||
                          (chat.running ? "Création en cours…" : "")}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
      {(chat.error || error || chat.snapshot?.run?.error) && (
        <p role="alert" className="px-4 text-sm text-destructive">
          {chat.error || error || chat.snapshot?.run?.error}
        </p>
      )}
      <form
        className="site-chat-composer p-4 border-t border-border [&_[data-slot=field-group]]:gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="site-model">Modèle</FieldLabel>
            <OptionSelect
              id="site-model"
              label="Modèle"
              value={chat.model}
              disabled={chat.running || chat.busy}
              onValueChange={chat.setModel}
              options={
                chat.configuration?.models.map((model) => ({
                  value: model.model,
                  label: model.displayName,
                })) ?? []
              }
            />
          </Field>
          {!chat.configuration?.available && (
            <p className="text-xs text-muted-foreground">
              {chat.configuration?.error ?? "Connexion au service IA…"}
            </p>
          )}
          <form.Field name="prompt">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="site-prompt">
                  Votre demande{selection ? " · élément sélectionné" : ""}
                </FieldLabel>
                <Textarea
                  id="site-prompt"
                  rows={4}
                  placeholder="Crée un site de conférence avec un programme et une inscription…"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby="site-prompt-error"
                />
                <p
                  id="site-prompt-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {field.state.meta.errors.map((e) => e?.message).join(", ")}
                </p>
              </Field>
            )}
          </form.Field>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                disabled ||
                chat.busy ||
                chat.running ||
                !chat.configuration?.available
              }
            >
              {chat.busy && <Spinner />}Générer
            </Button>
            {chat.running && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void chat.stop()}
              >
                Arrêter
              </Button>
            )}
            {error && (
              <Button
                type="button"
                variant="outline"
                disabled={disabled || chat.running}
                onClick={() =>
                  form.setFieldValue(
                    "prompt",
                    `Corrige cette erreur sans perdre mes ajustements : ${error.slice(0, 1500)}`
                  )
                }
              >
                Corriger
              </Button>
            )}
          </div>
        </FieldGroup>
      </form>
    </aside>
  )
}
