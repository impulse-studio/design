import { useId } from "react"
import type { Color } from "@digit-ai-studio/shared"
import { RiLinkUnlink } from "@remixicon/react"
import { useEditSession } from "./edit-session"
import { colorCss, resolveColor, toHex, withAlpha } from "@/lib/colors"
import type { ColorTokens } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { NumberInput } from "./NumberInput"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { ColorPicker } from "./ColorPicker"
import { ColorCodeInput } from "./ColorCodeInput"

export function ColorField({
  label,
  value,
  onChange,
  onAlphaChange,
  opacityValue,
  alpha = true,
  hideLabel = false,
  tokens,
  getSwatches,
  swatchesLabel,
  onEyeDropperUnavailable,
}: {
  label: string
  value: Color | undefined
  onChange: (color: Color) => void
  onAlphaChange?: (alpha: number) => void
  opacityValue?: number
  alpha?: boolean
  hideLabel?: boolean
  tokens?: ColorTokens
  getSwatches?: () => Color[]
  swatchesLabel?: string
  onEyeDropperUnavailable?: () => void
}) {
  const id = useId(),
    editor = useEditSession(),
    rgba = resolveColor(value, tokens)
  const apply = (color: Color) =>
    onChange(alpha ? color : toHex(resolveColor(color, tokens), false))
  const applyAlpha = (next: number) =>
    onAlphaChange ? onAlphaChange(next) : apply(withAlpha(value, next, tokens))
  const opacity = opacityValue ?? (value === undefined ? undefined : rgba.a)
  return (
    <Field className="editor-color-field gap-1.5">
      <FieldLabel htmlFor={id} className={hideLabel ? "sr-only" : undefined}>
        {label}
      </FieldLabel>
      <div className="editor-color-row flex items-center gap-0.75 h-[30px] rounded-[5px] bg-muted py-0.5 px-1 [&_>_.editor-color-code]:flex-1 [&_>_.editor-color-code]:min-w-0 [&_>_.editor-color-code]:border-0 [&_>_.editor-color-code]:shadow-none [&_>_.editor-color-code]:[padding:0_3px] [&_>_.editor-color-code]:bg-transparent [&_>_.editor-color-code]:text-[11px] [&_>_.editor-color-code]:h-[26px]">
        <Popover
          onOpenChange={(open) => {
            if (!open) editor.commit()
          }}
        >
          <PopoverTrigger
            render={
              <Button
                id={id}
                variant="ghost"
                size="icon-xs"
                aria-label={label}
              />
            }
          >
            <span
              className="editor-swatch inline-block w-[15px] h-[15px] rounded-[3px] border [border-color:color-mix(in srgb, var(--foreground), transparent 88%)] shrink-0"
              style={{ background: colorCss(value, tokens) }}
            />
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            className="editor-color-popover w-[280px] p-3 text-foreground bg-background text-[11px] [&_input]:bg-muted [&_input]:text-foreground"
          >
            <ColorPicker
              value={value}
              onChange={apply}
              onAlphaChange={applyAlpha}
              alpha={alpha}
              opacity={opacity}
              tokens={tokens}
              getSwatches={getSwatches}
              swatchesLabel={swatchesLabel}
              onEyeDropperUnavailable={onEyeDropperUnavailable}
            />
          </PopoverContent>
        </Popover>
        {typeof value === "object" ? (
          <>
            <span className="editor-color-token flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px]">{value.token}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Détacher le token couleur"
              onClick={() => apply(toHex(rgba))}
            >
              <RiLinkUnlink />
            </Button>
          </>
        ) : value === undefined ? (
          <span className="editor-color-token flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted-foreground">
            Mixte
          </span>
        ) : (
          <ColorCodeInput
            color={rgba}
            format="hex"
            label={`${label} HEX`}
            onChange={(color) => apply(toHex(color))}
          />
        )}
        {alpha && (
          <div className="editor-color-opacity flex items-center w-[53px] border-l border-border shrink-0 [&_input]:border-0 [&_input]:shadow-none [&_input]:[padding:0_3px] [&_input]:h-[26px] [&_input]:text-right [&_input]:text-[11px] [&_input]:bg-transparent [&_input]:[appearance:textfield] [&_input::-webkit-inner-spin-button]:appearance-none [&_>_span]:text-muted-foreground [&_>_span]:text-[10px] [&_>_span]:pr-0.5">
            <NumberInput
              label={`${label} opacité`}
              min={0}
              max={100}
              value={
                opacity === undefined ? undefined : Math.round(opacity * 100)
              }
              onChange={(next) => applyAlpha(next / 100)}
            />
            <span>%</span>
          </div>
        )}
      </div>
    </Field>
  )
}
