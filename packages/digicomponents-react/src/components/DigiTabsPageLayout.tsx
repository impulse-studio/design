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

export type DigiTabsPageLayoutProps = {
  "title": string
  "description"?: string
  "helpLink"?: string
  "feature"?: unknown
  "backCta"?: unknown
  "scrollable"?: false | true
  "fullWidthHeader"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"header-title" | "header-actions" | "tabs" | "body", ReactNode[]>>
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

export function DigiTabsPageLayout(props: DigiTabsPageLayoutProps) {
  return createElement(DigitComponentView, {
    component: "DigiTabsPageLayout",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
