import { createElement } from "react"
import type {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react"
import { DigitComponentView } from "../DigitComponentView"

export type DigiToggleableFormCardProps = {
  "title": string
  "description"?: string
  "helpLink"?: string
  "isLoading"?: false | true
  "disabled"?: false | true
  "hasModifications": false | true
  "resetCta"?: string
  "saveCta"?: string
  "smallSpacing"?: false | true
  "hideResetCta"?: false | true
  "toggleTooltip"?: string
  children?: ReactNode
  slots?: Partial<Record<"default" | "footer", ReactNode[]>>
  style?: CSSProperties
  class?: string
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  onChange?: ChangeEventHandler<HTMLElement>
  onFocus?: FocusEventHandler<HTMLElement>
  onBlur?: FocusEventHandler<HTMLElement>
  onKeyDown?: KeyboardEventHandler<HTMLElement>
  onSubmit?: FormEventHandler<HTMLElement>
}

export function DigiToggleableFormCard(props: DigiToggleableFormCardProps) {
  return createElement(DigitComponentView, {
    component: "DigiToggleableFormCard",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
