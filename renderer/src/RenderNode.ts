import { defineComponent, h, onErrorCaptured, ref, watch } from "vue"
import type { PropType, VNode } from "vue"
import type { Node } from "@digit-ai-studio/shared"
import { post } from "./bridge"
import { renderContent } from "./render-content"

export const RenderNode = defineComponent({
  name: "RenderNode",
  props: {
    node: { type: Object as PropType<Node>, required: true },
    parentDirection: {
      type: String as PropType<"row" | "column" | "grid">,
      default: "column",
    },
  },
  setup(props) {
    const error = ref<string | null>(null)
    const capture = (value: unknown) => {
      error.value = value instanceof Error ? value.message : String(value)
      post({ type: "error", nodeId: props.node.id, message: error.value })
      return false as const
    }
    onErrorCaptured(capture)
    watch(
      () => props.node,
      () => {
        error.value = null
      }
    )
    return (): VNode => {
      let content: VNode
      try {
        content = error.value
          ? h("div", { class: "studio-missing" }, error.value)
          : renderContent(props.node, props.parentDirection, RenderNode)
      } catch (value) {
        capture(value)
        content = h(
          "div",
          { class: "studio-missing" },
          error.value ?? "Erreur de rendu"
        )
      }
      return h(
        "div",
        { "data-editor-node": props.node.id, style: { display: "contents" } },
        [content]
      )
    }
  },
})
