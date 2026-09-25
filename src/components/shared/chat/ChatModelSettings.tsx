import { RiEqualizerLine } from "@remixicon/react"
import { useContext } from "react"
import { CHAT_EFFORTS, CHAT_MODELS } from "@/features/chat/catalog"
import { ThemeContext } from "@/features/theme/theme"
import type { ChatEffort } from "@/validators/chat/messages"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ReasoningEffort } from "@/components/shared/reasoning-effort/ReasoningEffort"

export function ChatModelSettings({
  model,
  effort,
  disabled,
  onModelChange,
  onEffortChange,
}: {
  model: string
  effort: ChatEffort
  disabled?: boolean
  onModelChange: (value: string) => void
  onEffortChange: (value: ChatEffort) => void
}) {
  const theme = useContext(ThemeContext)?.theme
  const current = CHAT_MODELS.find((item) => item.value === model)
  return (
    <div className="chat-model-settings flex min-w-0 items-center gap-1 [&_>_[data-slot=popover-trigger]]:h-[32px] [&_>_[data-slot=popover-trigger]]:px-1.5 [&_>_[data-slot=popover-trigger]]:text-[11px]">
      <Select
        value={model}
        onValueChange={(value) => {
          if (value) onModelChange(value)
        }}
        disabled={disabled}
      >
        <SelectTrigger
          variant="ghost"
          aria-label="Modèle IA"
          className="h-8 min-w-0 flex-1 px-1.5 text-[11px]"
        >
          <span className="truncate">
            {current?.provider} · {current?.label}
          </span>
        </SelectTrigger>
        <SelectContent align="start">
          {["OpenAI", "Claude", "Gemini"].map((provider) => (
            <SelectGroup key={provider}>
              <SelectLabel>{provider} · démo</SelectLabel>
              {CHAT_MODELS.filter((item) => item.provider === provider).map(
                (item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                )
              )}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-1.5 text-[11px]"
              disabled={disabled}
            />
          }
          aria-label={`Effort : ${CHAT_EFFORTS.find((item) => item.value === effort)?.label}`}
        >
          <RiEqualizerLine data-icon="inline-start" />
          {CHAT_EFFORTS.find((item) => item.value === effort)?.label}
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-64"
          data-theme={theme}
        >
          <ReasoningEffort
            value={effort}
            options={CHAT_EFFORTS}
            modelLabel={current?.label}
            onValueChange={(value) => {
              const option = CHAT_EFFORTS.find((item) => item.value === value)
              if (option) onEffortChange(option.value)
            }}
          />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Réglage simulé. Les capacités réelles dépendront du modèle connecté.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
