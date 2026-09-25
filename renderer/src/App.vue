<script setup lang="ts">
import { createElement } from "react"
import { createRoot } from "react-dom/client"
import type { Root } from "react-dom/client"
import type { EditorMode, FrameNode, Json } from "@digit-ai-studio/shared"
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from "vue"
import { createGeometryPreview } from "./geometry-preview"
import { collectLayout, frameId, onShellMessage, post } from "./bridge"
import { ReactRenderFrame } from "./ReactRenderFrame"

const serializeDomNode = (node: globalThis.Node): Json | null => {
  if (node.nodeType === globalThis.Node.TEXT_NODE)
    return { text: node.textContent ?? "" }
  if (!(node instanceof Element)) return null
  const slot = node.getAttribute("data-digit-slot-root")
  if (slot) return { slot }
  const attributes: Record<string, Json> = {}
  let className: string | undefined
  let inlineStyle: string | undefined
  for (const attribute of Array.from(node.attributes)) {
    const name = attribute.name
    if (/^on/i.test(name) || /^(?:srcdoc|data-editor-node|data-editor-text|data-digit-component|data-digit-slot-root)$/.test(name)) continue
    if (name === "class") {
      className = attribute.value
      continue
    }
    if (name === "style") {
      inlineStyle = attribute.value
        .split(";")
        .filter((part) => !/(?:url\s*\(|expression\s*\(|javascript:|@import|<)/i.test(part))
        .join(";")
        .slice(0, 4000)
      continue
    }
    if (["href", "src", "xlink:href"].includes(name.toLowerCase()) &&
      !/^(?:https?:\/\/|mailto:|tel:|#|\/|\.\/|\.\.\/|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(attribute.value)) continue
    attributes[name] = attribute.value
  }
  if (node instanceof HTMLInputElement && node.hasAttribute("value"))
    attributes.value = node.value
  const children = Array.from(node.childNodes)
    .map(serializeDomNode)
    .filter((child): child is Json => child !== null)
  return {
    tag: node.tagName.toLowerCase(),
    ...(className ? { className } : {}),
    ...(Object.keys(attributes).length ? { attributes } : {}),
    ...(inlineStyle ? { inlineStyle } : {}),
    children,
  }
}
const serializeComponent = (component: HTMLElement): Json => {
  const children = Array.from(component.childNodes)
    .map(serializeDomNode)
    .filter((child): child is Json => child !== null)
  if (children.length === 1 && typeof children[0] === "object" && !Array.isArray(children[0]))
    return children[0]
  return { tag: "div", inlineStyle: "display: contents", children }
}

const frame = shallowRef<FrameNode>({
  id: frameId,
  type: "frame",
  name: "Frame",
  x: 0,
  y: 0,
  width: 1440,
  height: 900,
  children: [],
})
const mode = ref<EditorMode>("edit")
const host = useTemplateRef<HTMLElement>("host")
const root = shallowRef<HTMLElement | null>(null)
const geometryPreview = createGeometryPreview(() => root.value, frameId)
let scheduled = 0
const publish = async () => {
  await nextTick()
  if (!root.value) return
  post({
    type: "rendered",
    contentWidth: Math.max(root.value.getBoundingClientRect().width, 1),
    contentHeight: Math.max(root.value.scrollHeight, 1),
    ...collectLayout(root.value, geometryPreview.active ? geometryPreview.ids : undefined),
    ...(geometryPreview.active ? { previewSession: geometryPreview.session, previewSequence: geometryPreview.sequence } : {}),
  })
}
const schedule = () => {
  if (scheduled) return
  scheduled = requestAnimationFrame(() => {
    scheduled = 0
    void publish()
  })
}
let reactRoot: Root | null = null
const renderReact = () => {
  if (!host.value) return
  reactRoot ??= createRoot(host.value)
  reactRoot.render(
    createElement(ReactRenderFrame, { frame: frame.value, mode: mode.value })
  )
  requestAnimationFrame(() => {
    root.value = host.value?.querySelector<HTMLElement>(".studio-frame") ?? null
    schedule()
  })
}
watch([frame, mode], renderReact, { flush: "post" })
let stopEditing: (() => void) | null = null
const editText = (id: string) => {
  stopEditing?.()
  const element = document.querySelector<HTMLElement>(
    `[data-editor-text="${CSS.escape(id)}"]`
  )
  if (!element) return
  const original = element.textContent ?? ""
  element.contentEditable = "true"
  element.focus({ preventScroll: true })
  const selection = window.getSelection(),
    range = document.createRange()
  range.selectNodeContents(element)
  selection?.removeAllRanges()
  selection?.addRange(range)
  let canceled = false
  const finish = () => {
    element.contentEditable = "false"
    element.removeEventListener("blur", finish)
    element.removeEventListener("keydown", key)
    stopEditing = null
    post({
      type: "textCommit",
      nodeId: id,
      value: canceled ? original : (element.textContent ?? ""),
    })
    schedule()
  }
  const key = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      canceled = true
      element.textContent = original
      element.blur()
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      element.blur()
    }
  }
  element.addEventListener("blur", finish)
  element.addEventListener("keydown", key)
  stopEditing = () => {
    canceled = true
    finish()
  }
}
const stopListening = onShellMessage((message) => {
  if (message.type === "init" || message.type === "replace") {
    geometryPreview.reset()
    frame.value = message.frame
    document.documentElement.classList.toggle(
      "dark",
      message.frame.theme === "dark"
    )
    if (message.type === "init") mode.value = message.mode
    schedule()
  }
  if (message.type === "geometry-preview") {
    if (geometryPreview.apply(message.session, message.sequence, message.patches)) schedule()
  }
  if (message.type === "mode") {
    geometryPreview.reset()
    mode.value = message.mode
    stopEditing?.()
  }
  if (message.type === "edit-text") editText(message.nodeId)
  if (message.type === "detach-component") {
    const component = root.value?.querySelector<HTMLElement>(
      `[data-editor-node="${CSS.escape(message.nodeId)}"][data-digit-component]`
    )
    if (!component) {
      post({ type: "error", nodeId: message.nodeId, message: "Composant introuvable dans le rendu React." })
      return
    }
    post({
      type: "detached",
      nodeId: message.nodeId,
      requestId: message.requestId,
      snapshot: serializeComponent(component),
    })
  }
})
let resize: ResizeObserver | undefined, mutations: MutationObserver | undefined
const previewKey = (event: KeyboardEvent) => {
  if (
    mode.value !== "preview" ||
    event.key !== "Escape" ||
    event.defaultPrevented
  )
    return
  const element = event.target as HTMLElement | null
  if (
    element?.closest(
      'input, textarea, [contenteditable="true"], [role="dialog"], [role="menu"], [role="listbox"]'
    )
  )
    return
  post({ type: "exitPreview" })
}
onMounted(async () => {
  renderReact()
  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  root.value = host.value?.querySelector<HTMLElement>(".studio-frame") ?? null
  resize = new ResizeObserver(schedule)
  mutations = new MutationObserver((records) => {
    // Geometry previews only change styles. Observe newly mounted components once,
    // rather than scanning every node again on each pointer movement.
    for (const record of records) for (const added of record.addedNodes) {
      if (!(added instanceof Element)) continue
      resize?.observe(added)
      for (const element of added.querySelectorAll("[data-editor-node] > *"))
        resize?.observe(element)
    }
    schedule()
  })
  if (root.value) {
    resize.observe(root.value)
    for (const element of root.value.querySelectorAll("[data-editor-node] > *"))
      resize.observe(element)
    mutations.observe(root.value, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })
  }
  window.addEventListener("resize", schedule)
  window.addEventListener("scroll", schedule, true)
  window.addEventListener("keydown", previewKey)
  void document.fonts.ready.then(schedule)
  post({ type: "ready" })
  schedule()
})
onBeforeUnmount(() => {
  geometryPreview.reset()
  resize?.disconnect()
  mutations?.disconnect()
  stopListening()
  cancelAnimationFrame(scheduled)
  window.removeEventListener("resize", schedule)
  window.removeEventListener("scroll", schedule, true)
  window.removeEventListener("keydown", previewKey)
  stopEditing?.()
  reactRoot?.unmount()
})
</script>

<template>
  <div ref="host" />
</template>
