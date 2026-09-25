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

export type DigiSettingsPageLayoutProps = {
  "title"?: string
  "description"?: string
  "helpLink"?: string
  "feature"?: unknown
  "parentRoute"?: unknown
  "parentRouteText"?: string
  "fullWidth"?: false | true
  "fullWidthHeader"?: false | true
  children?: ReactNode
  slots?: Partial<Record<"header-actions" | "header-title" | "default", ReactNode[]>>
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

export function DigiSettingsPageLayout(props: DigiSettingsPageLayoutProps) {
  return createElement(DigitComponentView, {
    component: "DigiSettingsPageLayout",
    props: props as unknown as Record<string, unknown>,
    children: props.children,
    slots: props.slots,
    style: props.style,
  })
}
