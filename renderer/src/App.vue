<template>
  <DigiComponentConfigProvider :config="config">
    <DigiTooltipProvider>
      <div ref="root" class="studio-frame" :class="{ 'studio-edit-mode': mode === 'edit' }">
        <RenderNode v-for="node in frame.children" :key="node.id" :node="node" />
      </div>
    </DigiTooltipProvider>
  </DigiComponentConfigProvider>
</template>

<script setup lang="ts">
import { demoFrame, type EditorMode, type FrameNode, type PointerEventType } from '@digit-ai-studio/shared'
import { DigiComponentConfigProvider, DigiTooltipProvider } from 'digicomponents'
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

import { collectRects, onShellMessage, post } from './bridge'
import { componentConfig as config } from './config'
import { RenderNode } from './RenderNode'

const frame = shallowRef<FrameNode>(demoFrame)
const mode = ref<EditorMode>(new URLSearchParams(location.search).get('mode') === 'edit' ? 'edit' : 'preview')
const root = useTemplateRef<HTMLElement>('root')

async function publishLayout(): Promise<void> {
  await nextTick()
  if (!root.value) return
  post({ type: 'rendered', contentHeight: root.value.scrollHeight, rects: collectRects(root.value) })
}

const stopListening = onShellMessage((message) => {
  if (message.type === 'init' || message.type === 'replace') {
    frame.value = message.frame
    if (message.type === 'init') mode.value = message.mode
    void publishLayout()
  }
  if (message.type === 'mode') mode.value = message.mode
})

// In edit mode clicks select nodes instead of reaching the components.
function nodeIdFrom(event: Event): string | null {
  const el = (event.target as Element | null)?.closest('[data-node-id]')
  return el?.getAttribute('data-node-id') ?? null
}

function onPointer(event: MouseEvent): void {
  if (mode.value !== 'edit') return
  event.preventDefault()
  event.stopPropagation()
  if (event.type === 'mousedown') return
  post({
    type: 'pointer',
    event: event.type as PointerEventType,
    nodeId: nodeIdFrom(event),
    shift: event.shiftKey,
    meta: event.metaKey,
    alt: event.altKey,
  })
}

const pointerEvents = ['mousedown', 'click', 'dblclick', 'mousemove'] as const
let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  for (const type of pointerEvents) window.addEventListener(type, onPointer, true)
  resizeObserver = new ResizeObserver(() => void publishLayout())
  if (root.value) resizeObserver.observe(root.value)
  post({ type: 'ready' })
  void publishLayout()
})

onBeforeUnmount(() => {
  for (const type of pointerEvents) window.removeEventListener(type, onPointer, true)
  resizeObserver?.disconnect()
  stopListening()
})
</script>
