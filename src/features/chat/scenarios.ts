import type { ChatRun } from "./types"
import type {
  ChatAnswers,
  ChatBlock,
  ChatQuestion,
} from "@/validators/chat/messages"
import { EXTERNAL_LINKS } from "@/constants"

export const demoQuestions: ChatQuestion[] = [
  {
    id: "layout",
    title: "Quelle présentation préférez-vous ?",
    description: "Choisissez une direction ou décrivez la vôtre.",
    required: true,
    multiple: false,
    choices: [
      { value: "table", label: "Un tableau compact" },
      { value: "cards", label: "Des cartes visuelles" },
    ],
  },
  {
    id: "features",
    title: "Quelles interactions sont utiles ?",
    description: "Plusieurs choix possibles. Cette question est facultative.",
    required: false,
    multiple: true,
    choices: [
      { value: "search", label: "Recherche" },
      { value: "filters", label: "Filtres" },
      { value: "export", label: "Export" },
    ],
  },
  {
    id: "notes",
    title: "Un détail à préciser ?",
    description: "Ajoutez vos contraintes, ou passez cette étape.",
    required: false,
    multiple: false,
    choices: [],
  },
]
export const summarizeAnswers = (
  questions: ChatQuestion[],
  answers: ChatAnswers
) =>
  questions
    .map((question) => {
      const answer = answers[question.id]
      const labels =
        answer?.selected.map(
          (value) =>
            question.choices.find((choice) => choice.value === value)?.label ??
            value
        ) ?? []
      if (answer?.custom.trim()) labels.push(answer.custom.trim())
      return `${question.title} ${labels.join(", ") || "Sans préférence"}`
    })
    .join("\n")

export const demoPlan = (run: ChatRun) =>
  [
    `Demande : ${run.request.text}`,
    run.answerSummary,
    run.request.context.length
      ? `Contexte : ${run.request.context.map((item) => item.label).join(", ")}.`
      : "Contexte : la page entière.",
    "Préparer une proposition, vérifier sa lisibilité et présenter le résultat. Toutes les actions restent simulées.",
  ]
    .filter(Boolean)
    .join("\n\n")

export const activityBlocks = (step: number): ChatBlock[] => {
  const labels = [
    "Lire la demande et son contexte",
    "Assembler les composants de la proposition",
    "Vérifier les états et la lisibilité",
  ]
  return [
    {
      type: "activity",
      active: step < 3,
      steps: labels.map((label, index) => ({
        id: `step-${index}`,
        label,
        status:
          index < step ? "complete" : index === step ? "active" : "pending",
      })),
    },
    {
      type: "tasks",
      tasks: labels.map((label, index) => ({
        id: `task-${index}`,
        label,
        status:
          index < step
            ? "completed"
            : index === step
              ? "in-progress"
              : "pending",
      })),
    },
  ]
}

export const demoResponse = (run: ChatRun) =>
  [
    "### Votre proposition est prête",
    `Voici un aperçu local pour votre demande : « ${run.request.text} »`,
    run.answerSummary
      ? `**Préférences retenues**\n\n${run.answerSummary
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")}`
      : "Une composition claire, une action principale et des états de chargement accessibles.",
    "1. Une hiérarchie visuelle lisible.\n2. Des composants réutilisables.\n3. Des interactions accessibles au clavier.",
    '```tsx\n<Button variant="outline">Voir les participants</Button>\n```',
    "*Démonstration terminée. Votre maquette n’a pas été modifiée.*",
  ].join("\n\n")

export const resultBlocks = (run: ChatRun): ChatBlock[] =>
  run.request.scenario === "illustration"
    ? [
        {
          type: "image",
          status: "complete",
          prompt:
            "Illustration de démonstration : lac alpin au lever du soleil",
        },
        {
          type: "sources",
          text: "Cette proposition illustre une composition de composants [1] et des interactions accessibles [2]. Références fournies pour la démonstration, sans recherche en direct.",
          refs: [
            {
              n: 1,
              label: "Composants shadcn/ui",
              host: "ui.shadcn.com",
              url: EXTERNAL_LINKS.shadcnComponents,
            },
            {
              n: 2,
              label: "Accessibilité des interfaces",
              host: "w3.org",
              url: EXTERNAL_LINKS.accessibility,
            },
          ],
        },
      ]
    : [
        {
          type: "diff",
          file: "Proposition d’interface · aperçu simulé",
          rows: [
            { old: 1, cur: 1, type: "ctx", text: "<section>" },
            {
              old: 2,
              cur: null,
              type: "del",
              text: '  <div class="gap-2">Participants</div>',
            },
            { old: null, cur: 2, type: "add", text: '  <div class="gap-4">' },
            {
              old: null,
              cur: 3,
              type: "add",
              text: "    <h2>Participants</h2>",
            },
            {
              old: null,
              cur: 4,
              type: "add",
              text: '    <Button variant="outline">Filtrer</Button>',
            },
            { old: null, cur: 5, type: "add", text: "  </div>" },
            { old: 3, cur: 6, type: "ctx", text: "</section>" },
          ],
        },
      ]
