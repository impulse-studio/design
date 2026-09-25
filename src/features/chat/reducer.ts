import { CHAT_MODELS } from "./catalog"
import {
  activityBlocks,
  demoPlan,
  demoQuestions,
  demoResponse,
  resultBlocks,
  summarizeAnswers,
} from "./scenarios"
import type {
  ChatAnswers,
  ChatAttachment,
  ChatBlock,
  ChatContextItem,
  ChatEffort,
  ChatMessage,
  ChatRun,
  ChatScenario,
  ChatState,
} from "./types"

export const initialChatState = (): ChatState => ({
  ready: false,
  demo: false,
  model: "demo-opus",
  effort: "medium",
  drafts: {
    disconnected: { text: "", attachments: [] },
    demo: { text: "", attachments: [] },
  },
  messages: [],
  run: null,
  ignoredContext: [],
  focusRequest: 0,
  notice: null,
})
export const draftKey = (state: ChatState) =>
  state.demo ? "demo" : "disconnected"
export const isGenerating = (run: ChatRun | null) =>
  Boolean(run && ["thinking", "working", "streaming"].includes(run.phase))

export const interruptMessage = (message: ChatMessage): ChatMessage => {
  if (
    !message.status ||
    !["thinking", "waiting", "working", "streaming"].includes(message.status)
  )
    return message
  return {
    ...message,
    status: "stopped",
    blocks: message.blocks?.map((block): ChatBlock => {
      if (block.type === "thinking" || block.type === "activity")
        return { ...block, active: false }
      if (block.type === "approval" && block.status === "pending")
        return { ...block, status: "rejected" }
      if (
        block.type === "tool" &&
        (block.status === "pending" || block.status === "running")
      )
        return { ...block, status: "denied" }
      if (block.type === "image" && block.status !== "complete")
        return { ...block, status: "error" }
      if (block.type === "tasks")
        return {
          ...block,
          tasks: block.tasks.map((task) =>
            task.status === "in-progress"
              ? { ...task, status: "pending" }
              : task
          ),
        }
      return block
    }),
  }
}

export type ChatAction =
  | { type: "hydrate"; state: ChatState }
  | { type: "mode"; demo: boolean }
  | { type: "draft"; text: string }
  | { type: "attachments"; items: ChatAttachment[] }
  | { type: "model"; value: string }
  | { type: "effort"; value: ChatEffort }
  | { type: "context"; id: string }
  | { type: "notice"; text: string | null }
  | {
      type: "send"
      id: string
      text: string
      context: ChatContextItem[]
      scenario?: ChatScenario
    }
  | { type: "tick"; id: string; phase: ChatRun["phase"]; step: number }
  | { type: "answers"; id: string; answers: ChatAnswers; current: string }
  | { type: "submit-answers"; id: string }
  | { type: "approve" | "reject" | "changes"; id: string }
  | { type: "tool"; id: string; approved: boolean }
  | { type: "feedback"; id: string; value: "up" | "down" | null }
  | { type: "retry"; id: string; newId: string }
  | { type: "stop" }
  | { type: "reset" }

const updateMessage = (
  state: ChatState,
  id: string,
  update: (message: ChatMessage) => ChatMessage
): ChatState => ({
  ...state,
  messages: state.messages.map((message) =>
    message.id === id ? update(message) : message
  ),
})
const updateBlocks = (
  state: ChatState,
  id: string,
  update: (blocks: ChatBlock[]) => ChatBlock[],
  status?: ChatMessage["status"]
) =>
  updateMessage(state, id, (message) => ({
    ...message,
    status: status ?? message.status,
    blocks: update(message.blocks ?? []),
  }))
const finishThinking = (blocks: ChatBlock[]): ChatBlock[] =>
  blocks.map((block) =>
    block.type === "thinking" ? { ...block, active: false } : block
  )
const begin = (state: ChatState, run: ChatRun): ChatState => ({
  ...state,
  run,
  notice: null,
  messages: [
    ...state.messages,
    {
      id: run.id,
      role: "assistant",
      text: "",
      status: "thinking",
      request: run.request,
      attempt: run.attempt,
      blocks: [
        {
          type: "thinking",
          active: true,
          lines: [
            "Lecture de votre demande et du contexte joint.",
            "Préparation d’une proposition de démonstration.",
          ],
        },
      ],
    },
  ],
})

export const chatReducer = (
  state: ChatState,
  action: ChatAction
): ChatState => {
  if (action.type === "hydrate")
    return state.ready ? state : { ...action.state, ready: true }
  if (!state.ready) return state
  const key = draftKey(state)
  if (action.type === "mode")
    return {
      ...state,
      demo: action.demo,
      messages: state.messages.map(interruptMessage),
      run: null,
      notice: null,
      focusRequest: state.focusRequest + 1,
    }
  if (action.type === "draft")
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [key]: { ...state.drafts[key], text: action.text },
      },
    }
  if (action.type === "attachments")
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [key]: { ...state.drafts[key], attachments: action.items },
      },
    }
  if (action.type === "model")
    return state.run ||
      !CHAT_MODELS.some((model) => model.value === action.value)
      ? state
      : { ...state, model: action.value }
  if (action.type === "effort")
    return state.run ? state : { ...state, effort: action.value }
  if (action.type === "context")
    return {
      ...state,
      ignoredContext: state.ignoredContext.includes(action.id)
        ? state.ignoredContext.filter((id) => id !== action.id)
        : [...state.ignoredContext, action.id],
    }
  if (action.type === "notice") return { ...state, notice: action.text }
  if (action.type === "stop")
    return {
      ...state,
      messages: state.messages.map(interruptMessage),
      run: null,
    }
  if (action.type === "reset")
    return {
      ...state,
      messages: [],
      run: null,
      drafts: { ...state.drafts, demo: { text: "", attachments: [] } },
      notice: null,
      focusRequest: state.focusRequest + 1,
    }
  if (action.type === "feedback")
    return updateMessage(state, action.id, (message) => ({
      ...message,
      feedback: action.value,
    }))
  if (action.type === "send") {
    if (!state.demo || state.run) return state
    const attachments = state.drafts.demo.attachments
    if (
      (!action.text.trim() && !attachments.length) ||
      attachments.some((item) => !item.blobUrl)
    )
      return state
    if (action.scenario === "selection" && !action.context.length)
      return {
        ...state,
        notice: "Sélectionnez au moins un calque pour essayer ce scénario.",
      }
    const request = {
      text: action.text.trim() || "Décrire les pièces jointes.",
      model: state.model,
      effort: state.effort,
      context: action.context,
      attachments,
      scenario: action.scenario ?? "create",
    }
    const next = {
      ...state,
      ignoredContext: [],
      drafts: { ...state.drafts, demo: { text: "", attachments: [] } },
      messages: [
        ...state.messages,
        {
          id: `${action.id}-user`,
          role: "user" as const,
          text: request.text,
          request,
          blocks: attachments.length
            ? [{ type: "attachments" as const, items: attachments }]
            : [],
        },
      ],
    }
    return begin(next, {
      id: action.id,
      request,
      phase: "thinking",
      step: 0,
      attempt: 0,
      answerSummary: "",
    })
  }
  if (action.type === "retry") {
    const message = state.messages.find((item) => item.id === action.id)
    if (
      !state.demo ||
      state.run ||
      !message?.request ||
      message.role !== "assistant"
    )
      return state
    if (message.request.attachments.some((item) => !item.blobUrl))
      return {
        ...state,
        notice:
          "Les fichiers de ce message ne sont plus disponibles. Joignez-les à nouveau dans une nouvelle demande.",
      }
    return begin(state, {
      id: action.newId,
      request: message.request,
      phase: "thinking",
      step: 0,
      attempt: (message.attempt ?? 0) + 1,
      answerSummary: "",
    })
  }
  const run = state.run
  if (!state.demo || !run || action.id !== run.id) return state
  if (action.type === "answers" && run.phase === "questions") {
    return updateBlocks(state, run.id, (blocks) =>
      blocks.map((block) =>
        block.type === "questions"
          ? { ...block, answers: action.answers, current: action.current }
          : block
      )
    )
  }
  if (action.type === "submit-answers" && run.phase === "questions") {
    const block = state.messages
      .find((message) => message.id === run.id)
      ?.blocks?.find((item) => item.type === "questions")
    if (
      !block ||
      block.questions.some(
        (question) =>
          question.required &&
          !block.answers[question.id]?.selected.length &&
          !block.answers[question.id]?.custom.trim()
      )
    )
      return state
    const nextRun: ChatRun = {
      ...run,
      phase: "approval",
      answerSummary: summarizeAnswers(block.questions, block.answers),
    }
    const next = updateBlocks(
      state,
      run.id,
      (blocks) => [
        ...blocks.map((item): ChatBlock =>
          item.type === "questions" ? { ...item, submitted: true } : item
        ),
        { type: "approval", status: "pending", description: demoPlan(nextRun) },
      ],
      "waiting"
    )
    return { ...next, run: nextRun }
  }
  if (
    ["approve", "reject", "changes"].includes(action.type) &&
    run.phase === "approval"
  ) {
    const status =
      action.type === "approve"
        ? "approved"
        : action.type === "reject"
          ? "rejected"
          : "changes-requested"
    const next = updateBlocks(state, run.id, (blocks) =>
      blocks.map((block) =>
        block.type === "approval" ? { ...block, status } : block
      )
    )
    if (action.type === "approve")
      return {
        ...updateBlocks(next, run.id, (blocks) => [
          ...blocks,
          {
            type: "tool",
            status: "pending",
            target:
              run.request.context.map((item) => item.label).join(", ") ||
              "Page entière",
          },
        ]),
        run: { ...run, phase: "tool" },
      }
    return {
      ...updateMessage(next, run.id, (message) => ({
        ...message,
        status: "complete",
        text:
          action.type === "changes"
            ? "Précisez les modifications souhaitées dans votre prochain message."
            : "Proposition refusée. Aucune action n’a été lancée.",
      })),
      run: null,
      focusRequest: state.focusRequest + 1,
      drafts:
        action.type === "changes"
          ? {
              ...state.drafts,
              demo: {
                ...state.drafts.demo,
                text: `Revoir la proposition « ${run.request.text} » : `,
              },
            }
          : state.drafts,
    }
  }
  if (action.type === "tool" && run.phase === "tool") {
    const next = updateBlocks(
      state,
      run.id,
      (blocks) =>
        blocks.map((block) =>
          block.type === "tool"
            ? { ...block, status: action.approved ? "running" : "denied" }
            : block
        ),
      action.approved ? "working" : "complete"
    )
    if (!action.approved)
      return {
        ...updateMessage(next, run.id, (message) => ({
          ...message,
          text: "Action refusée. La simulation s’arrête ici.",
        })),
        run: null,
      }
    return {
      ...updateBlocks(next, run.id, (blocks) => [
        ...blocks,
        ...activityBlocks(0),
        ...(run.request.scenario === "illustration"
          ? [
              {
                type: "image" as const,
                status: "generating" as const,
                prompt:
                  "Illustration de démonstration : lac alpin au lever du soleil",
              },
            ]
          : []),
      ]),
      run: { ...run, phase: "working", step: 0 },
    }
  }
  if (
    action.type !== "tick" ||
    run.phase !== action.phase ||
    run.step !== action.step
  )
    return state
  if (run.phase === "thinking") {
    if (run.request.scenario === "error" && run.attempt === 0)
      return {
        ...updateMessage(state, run.id, (message) => ({
          ...message,
          status: "error",
          text: "La réponse a été interrompue pour illustrer une erreur. Vous pouvez relancer cette demande ; la prochaine tentative poursuivra la démonstration.",
          blocks: finishThinking(message.blocks ?? []),
        })),
        run: null,
      }
    const phase =
      run.request.scenario === "illustration" ? "approval" : "questions"
    return {
      ...updateBlocks(
        state,
        run.id,
        (blocks) => [
          ...finishThinking(blocks),
          phase === "approval"
            ? {
                type: "approval",
                status: "pending",
                description: demoPlan(run),
              }
            : {
                type: "questions",
                questions: demoQuestions,
                answers: {},
                current: "layout",
                submitted: false,
              },
        ],
        "waiting"
      ),
      run: { ...run, phase },
    }
  }
  if (run.phase === "working") {
    const step = run.step + 1
    const next = updateBlocks(
      state,
      run.id,
      (blocks) => [
        ...blocks
          .filter(
            (block) =>
              block.type !== "activity" &&
              block.type !== "tasks" &&
              block.type !== "image"
          )
          .map((block): ChatBlock =>
            block.type === "tool" && step === 3
              ? { ...block, status: "complete" }
              : block
          ),
        ...activityBlocks(step),
        ...(step === 3
          ? resultBlocks(run)
          : run.request.scenario === "illustration"
            ? [
                {
                  type: "image" as const,
                  status: "refining" as const,
                  prompt:
                    "Illustration de démonstration : lac alpin au lever du soleil",
                },
              ]
            : []),
      ],
      step === 3 ? "streaming" : "working"
    )
    return {
      ...next,
      run: {
        ...run,
        phase: step === 3 ? "streaming" : "working",
        step: step === 3 ? 0 : step,
      },
    }
  }
  if (run.phase === "streaming") {
    const response = demoResponse(run)
    const length = Math.min((run.step + 1) * 24, response.length)
    return {
      ...updateMessage(state, run.id, (message) => ({
        ...message,
        text: response.slice(0, length),
        status: length === response.length ? "complete" : "streaming",
      })),
      run: length === response.length ? null : { ...run, step: run.step + 1 },
    }
  }
  return state
}
