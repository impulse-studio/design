import { useEffect, useMemo, useState } from "react"
import type { Color } from "@digit-ai-studio/shared"
import { RiDropperLine } from "@remixicon/react"
import {
  clamp,
  colorCss,
  hsvToRgb,
  resolveColor,
  rgbToHsv,
  toHex,
  withAlpha,
} from "@/lib/colors"
import type { ColorFormat, ColorTokens } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectField } from "./SelectField"
import { NumberInput } from "./NumberInput"
import { ColorCodeInput } from "./ColorCodeInput"
import { SearchField } from "@/components/shared/SearchField"
import { usePointerEditGesture } from "./use-pointer-edit-gesture"
import { useContinuousEdit } from "./use-continuous-edit"

const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "Hex" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "css", label: "CSS" },
]
// Arrow key → [saturation, value] direction on the color plane.
const PLANE_KEYS: Partial<Record<string, [number, number]>> = {
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
}

export function ColorPicker({
  value,
  onChange,
  onAlphaChange,
  opacity,
  alpha = true,
  tokens = {},
  getSwatches,
  swatchesLabel = "Couleurs récentes",
  onEyeDropperUnavailable,
}: {
  value: Color | undefined
  onChange: (value: Color) => void
  onAlphaChange: (alpha: number) => void
  /** Opacity shown in the numeric input, `undefined` when mixed. */
  opacity: number | undefined
  alpha?: boolean
  /** Library colors offered in the second tab. */
  tokens?: ColorTokens
  /** Quick picks, read once when the picker opens. */
  getSwatches?: () => Color[]
  swatchesLabel?: string
  onEyeDropperUnavailable?: () => void
}) {
  const rgba = resolveColor(value, tokens),
    hsv = rgbToHsv(rgba)
  const [hue, setHue] = useState(hsv.h),
    [format, setFormat] = useState<ColorFormat>("hex"),
    [search, setSearch] = useState(""),
    [swatches] = useState(() => getSwatches?.() ?? [])
  const tokenList = useMemo(
    () =>
      Object.keys(tokens).map((name) => ({
        name,
        key: name.toLowerCase(),
        css: colorCss({ token: name }, tokens),
      })),
    [tokens]
  )
  const query = search.toLowerCase()
  useEffect(() => {
    if (hsv.s > 0) setHue(hsv.h)
  }, [hsv.h, hsv.s])
  const custom = (color: typeof rgba) => onChange(toHex(color))
  const setPlane = (s: number, v: number) =>
    custom(hsvToRgb({ h: hue, s: clamp(s), v: clamp(v) }, rgba.a))
  const pick = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPlane(
      (event.clientX - rect.x) / rect.width,
      1 - (event.clientY - rect.y) / rect.height
    )
  }
  const planeGesture = usePointerEditGesture<HTMLDivElement>({
    onBegin: (event) => {
      event.currentTarget.focus()
      pick(event)
    },
    onMove: pick,
  })
  const sliderGesture = useContinuousEdit()
  const sample = async () => {
    const picker = (
      window as unknown as {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
      }
    ).EyeDropper
    if (!picker) {
      onEyeDropperUnavailable?.()
      return
    }
    try {
      const result = await new picker().open()
      onChange(withAlpha(result.sRGBHex, rgba.a))
    } catch {
      /* Escape cancels sampling. */
    }
  }
  return (
    <Tabs
      defaultValue={typeof value === "object" ? "tokens" : "custom"}
      className="editor-color-picker"
    >
      <TabsList className="w-full">
        <TabsTrigger value="custom">Personnalisé</TabsTrigger>
        <TabsTrigger value="tokens">Bibliothèque</TabsTrigger>
      </TabsList>
      <TabsContent value="custom">
        <div
          className="editor-color-plane h-[184px] mt-3 relative rounded-[5px] touch-none cursor-crosshair [background-image:linear-gradient(to_top,_#000,_transparent),_linear-gradient(to_right,_#fff,_transparent)] [&_>_span]:absolute [&_>_span]:w-[13px] [&_>_span]:h-[13px] [&_>_span]:border-2 [&_>_span]:border-white [&_>_span]:rounded-full [&_>_span]:shadow-[0_0_0_1px_#0006,_0_1px_3px_#0005] [&_>_span]:-translate-x-1/2 [&_>_span]:-translate-y-1/2 [&_>_span]:pointer-events-none"
          role="slider"
          aria-label="Saturation et luminosité"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.s * 100)}
          aria-valuetext={`Saturation ${Math.round(hsv.s * 100)} %, luminosité ${Math.round(hsv.v * 100)} %`}
          tabIndex={0}
          style={{ backgroundColor: `hsl(${hue} 100% 50%)` }}
          onPointerDown={planeGesture.onPointerDown}
          onPointerMove={planeGesture.onPointerMove}
          onPointerUp={planeGesture.onPointerUp}
          onPointerCancel={planeGesture.onPointerCancel}
          onLostPointerCapture={planeGesture.onLostPointerCapture}
          onKeyDown={(event) => {
            const direction = PLANE_KEYS[event.key]
            if (!direction) return
            event.preventDefault()
            event.stopPropagation()
            const step = event.shiftKey ? 0.1 : 0.01
            setPlane(hsv.s + direction[0] * step, hsv.v + direction[1] * step)
          }}
        >
          <span
            style={{
              left: `${hsv.s * 100}%`,
              top: `${(1 - hsv.v) * 100}%`,
              background: toHex(rgba, false),
            }}
          />
        </div>
        <div className="editor-color-sliders flex gap-2.5 items-center my-3.5 [&_>_div]:flex-1 [&_>_div]:flex [&_>_div]:gap-3.5 [&_>_div]:flex-col [&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-thumb]]:w-[12px] [&_[data-slot=slider-thumb]]:h-[12px] [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:shadow-[0_0_0_1px_#0004]">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Prélever une couleur à l’écran"
            onClick={() => void sample()}
          >
            <RiDropperLine />
          </Button>
          <div>
            <Slider
              className="editor-hue-slider [&_[data-slot=slider-track]]:[background:linear-gradient(to_right,_red,_#ff0,_#0f0,_#0ff,_#00f,_#f0f,_red)]"
              aria-label="Teinte"
              thumbProps={{ "aria-label": "Teinte" }}
              value={[hue]}
              min={0}
              max={359}
              onValueChange={(next) => {
                sliderGesture.update(() => {
                  const h = Array.isArray(next) ? next[0]! : next
                  setHue(h)
                  custom(hsvToRgb({ ...hsv, h }, rgba.a))
                })
              }}
              onValueCommitted={sliderGesture.commit}
            />
            {alpha && (
              <Slider
                className="editor-alpha-slider [&_[data-slot=slider-track]]:[background:linear-gradient(to_right,_transparent,_var(--color-current)),_repeating-conic-gradient(#aaa_0%_25%,_#fff_0%_50%)_0_/_8px_8px]"
                style={
                  {
                    "--color-current": toHex(rgba, false),
                  } as React.CSSProperties
                }
                aria-label="Opacité de la couleur"
                thumbProps={{ "aria-label": "Opacité de la couleur" }}
                value={[Math.round(rgba.a * 100)]}
                onValueChange={(next) => {
                  sliderGesture.update(() =>
                    onAlphaChange(
                      (Array.isArray(next) ? next[0]! : next) / 100
                    )
                  )
                }}
                onValueCommitted={sliderGesture.commit}
              />
            )}
          </div>
        </div>
        <div className="editor-color-format flex items-end gap-1.25 [&_>_[data-slot=field]]:w-[64px] [&_>_[data-slot=field]]:shrink-0 [&_[data-slot=field-label]]:hidden [&_input]:text-[11px] [&_input]:px-1.75 [&_input]:h-[28px] [&_input[type=number]]:w-[50px] [&_input[type=number]]:shrink-0">
          <SelectField
            contentClassName="editor-chrome-popup text-foreground bg-background text-[11px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:text-[12px] [&_:is([data-slot=dropdown-menu-item],_[data-slot=select-item])]:min-h-[28px]"
            triggerClassName="bg-muted text-foreground"
            placeholder="Mixte"
            label="Format"
            value={format}
            options={FORMAT_OPTIONS}
            onChange={setFormat}
          />
          <ColorCodeInput
            color={rgba}
            format={format}
            onChange={custom}
            label={`Valeur ${format.toUpperCase()}`}
          />
          {alpha && (
            <NumberInput
              label="Opacité de la couleur en pourcentage"
              min={0}
              max={100}
              value={
                opacity === undefined ? undefined : Math.round(opacity * 100)
              }
              onChange={(next) => onAlphaChange(next / 100)}
            />
          )}
        </div>
        {swatches.length > 0 && (
          <>
            <p className="editor-color-section-label text-muted-foreground text-[11px] [margin:18px_0_10px]">{swatchesLabel}</p>
            <div className="editor-color-swatches grid grid-cols-[repeat(8,_1fr)] gap-1.5 [&_button]:[padding:0] [&_button]:overflow-hidden [&_button]:[background:repeating-conic-gradient(#aaa_0%_25%,_#fff_0%_50%)_0_/_8px_8px] [&_span]:w-full [&_span]:h-full">
              {swatches.map((color) => (
                <Button
                  key={JSON.stringify(color)}
                  variant="outline"
                  size="icon-xs"
                  aria-label={`Utiliser ${typeof color === "object" ? color.token : color}`}
                  onClick={() => onChange(color)}
                >
                  <span style={{ background: colorCss(color, tokens) }} />
                </Button>
              ))}
            </div>
          </>
        )}
      </TabsContent>
      <TabsContent value="tokens">
        <SearchField
          className="my-3"
          label="Rechercher un token couleur"
          placeholder="Rechercher une couleur…"
          value={search}
          onValueChange={setSearch}
        />
        <div className="editor-token-list max-h-[330px] overflow-y-auto pt-2">
          {tokenList
            .filter((token) => token.key.includes(query))
            .map(({ name, css }) => (
              <Button
                key={name}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => onChange({ token: name })}
              >
                <span className="editor-swatch inline-block w-[15px] h-[15px] rounded-[3px] border [border-color:color-mix(in srgb, var(--foreground), transparent 88%)] shrink-0" style={{ background: css }} />
                <span className="truncate">{name}</span>
              </Button>
            ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
