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

export type DigiTablePageLayoutProps = {
  "title"?: string
  "description"?: string
  "helpLink"?: string
  "feature"?: unknown
  "createCta"?: string
  "parentRoute"?: unknown
  "parentRouteText"?: string
  "fullWidth"?: false | true
  "fullWidthHeader"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"create-action" | "search-form" | "table" | "pagination" | "footer-actions", ReactNode[]>>
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

export function DigiTablePageLayout(props: DigiTablePageLayoutProps) {
  return createElement(DigitComponentView, {
    component: "DigiTablePageLayout",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
