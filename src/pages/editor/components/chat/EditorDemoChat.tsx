import { findNode, nodeLabel } from "@digit-ai-studio/shared"
import { useEditorState } from "@/features/editor/context"
import { framesOf } from "@/features/editor/document"
import { useEditorChat } from "@/features/chat/context"
import type { ChatScenario } from "@/features/chat/types"
import { ChatConversation } from "@/components/shared/chat/ChatConversation"
import { ChatComposer } from "@/components/shared/chat/ChatComposer"
import { ChatHeader } from "@/components/shared/chat/ChatHeader"
import { ChatWelcome } from "@/components/shared/chat/ChatWelcome"

export function EditorDemoChat({ mockupId }: { mockupId: string }) {
  const { state, dispatch, send, callbacks } = useEditorChat()
  const selectedIds = useEditorState((s) => s.selectedIds)
  const doc = useEditorState((s) => s.doc)
  const selection = selectedIds.flatMap((id) => {
    const node = findNode(framesOf(doc), id)?.node
    return node ? [{ id, label: nodeLabel(node) }] : []
  })
  const context = selection.filter(
    (item) => !state.ignoredContext.includes(item.id)
  )
  const onSend = (text: string, scenario?: ChatScenario) =>
    send(text, context, scenario)
  return (
    <div className="editor-chat flex flex-col h-full min-h-0 min-w-0 [container-type:inline-size] [&_:is(button,_input,_textarea,_a):focus-visible]:[outline-offset:3px] [@media(pointer:coarse)]:[&_button]:min-h-[44px] [@media(pointer:coarse)]:[&_textarea]:text-[16px] motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:[transition:none] motion-reduce:[&_*]:[scroll-behavior:auto] motion-reduce:[&_*::before]:animate-none motion-reduce:[&_*::before]:[transition:none] motion-reduce:[&_*::before]:[scroll-behavior:auto] motion-reduce:[&_*::after]:animate-none motion-reduce:[&_*::after]:[transition:none] motion-reduce:[&_*::after]:[scroll-behavior:auto]" data-mockup-id={mockupId}>
      <ChatHeader
        demo={state.demo}
        onExit={() => dispatch({ type: "mode", demo: false })}
        onReset={() => dispatch({ type: "reset" })}
      />
      <ChatConversation
        key={state.demo ? "demo" : "disconnected"}
        messages={state.demo ? state.messages : []}
        streaming={state.run?.phase === "streaming"}
        activeMessageId={state.run?.id}
        canRetry={state.demo}
        {...callbacks}
        emptyState={
          <ChatWelcome
            demo={state.demo}
            ready={state.ready}
            hasSelection={context.length > 0}
            onEnableDemo={() => dispatch({ type: "mode", demo: true })}
            onSelect={(scenario, prompt) =>
              state.demo
                ? onSend(prompt, scenario)
                : dispatch({ type: "draft", text: prompt })
            }
          />
        }
      />
      <ChatComposer selection={selection} onSend={onSend} />
    </div>
  )
}
