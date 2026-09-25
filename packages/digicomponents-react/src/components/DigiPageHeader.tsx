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

export type DigiPageHeaderProps = {
  "title": string
  "description"?: string
  "helpLink"?: string
  "feature"?: unknown
  "parentRoute"?: unknown
  "parentRouteText"?: string
  "fullWidth"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"header-title" | "actions", ReactNode[]>>
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

export function DigiPageHeader(props: DigiPageHeaderProps) {
  return createElement(DigitComponentView, {
    component: "DigiPageHeader",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
