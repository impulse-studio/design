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

export type DigiCollapsibleProps = {
  "disabled"?: false | true
  "open"?: false | true
  "defaultOpen"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"default", ReactNode[]>>
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

export function DigiCollapsible(props: DigiCollapsibleProps) {
  return createElement(DigitComponentView, {
    component: "DigiCollapsible",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
