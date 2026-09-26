import { EXTERNAL_LINKS } from "@/constants"
import { getProperties } from "./properties"
import type { CatalogDefinition, CatalogEntry } from "./types"

const definitions: CatalogDefinition[] = [
  {
    id: "file-tree",
    name: "File Tree",
    description: "Parcourir les fichiers au clavier et déplier les dossiers.",
    category: "Navigation",
    kind: "component",
    importPath: "@/components/ui/file-tree",
    documentation: null,
    variants: [],
    sizes: [],
    states: ["default"],
    load: () =>
      import("@/components/design-system/examples/FileTreeExample").then(
        (module) => ({
          Component: module.FileTreeExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "shared-layout-bg",
    name: "Shared Layout Background",
    description: "Suivre le survol d’une liste avec un fond partagé.",
    category: "Affichage",
    kind: "component",
    importPath: "@/components/ui/shared-layout-bg",
    documentation: null,
    variants: [],
    sizes: [],
    states: ["default"],
    load: () =>
      import("@/components/design-system/examples/SharedLayoutBackgroundExample").then(
        (module) => ({
          Component: module.SharedLayoutBackgroundExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "not-found",
    importPath: "@/components/shared/not-found/NotFoundGlitch",
    documentation: null,
    name: "Not Found",
    description: "Page 404 avec effet Glitch et action de navigation.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/NotFoundExample").then(
        (module) => ({
          Component: module.NotFoundExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "range-slider",
    importPath: "@/components/shared/motion/RangeSlider",
    documentation: null,
    name: "Range Slider",
    description: "Curseur gradué avec poignée et progression animées.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/RangeSliderExample").then(
        (module) => ({
          Component: module.RangeSliderExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "ai-sidebar",
    importPath: "@/components/shared/ai-sidebar/AISidebar",
    documentation: null,
    name: "AI Sidebar",
    description: "Organiser les projets, dossiers, fichiers et favoris.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/AISidebarExample").then(
        (module) => ({
          Component: module.AISidebarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "agent-activity",
    importPath: "@/components/shared/agent-activity/AgentActivity",
    documentation: null,
    name: "Agent Activity",
    description: "Suivre les étapes, recherches et outils d’un agent.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/AgentActivityExample").then(
        (module) => ({
          Component: module.AgentActivityExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "tool-approval",
    importPath: "@/components/shared/tool-approval/ToolApproval",
    documentation: null,
    name: "Tool Approval",
    description:
      "Examiner les paramètres d’un outil et autoriser ou refuser son exécution.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/ToolApprovalExample").then(
        (module) => ({
          Component: module.ToolApprovalExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "image-generation",
    importPath: "@/components/shared/image-generation/ImageGeneration",
    documentation: null,
    name: "Image Generation",
    description: "Aperçu animé des étapes de génération d’une image.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/ImageGenerationExample").then(
        (module) => ({
          Component: module.ImageGenerationExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "streaming-response",
    importPath: "@/components/shared/streaming/StreamingResponse",
    documentation: null,
    name: "Streaming Response",
    description: "Réponse progressive avec sources, copie et avis.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/StreamingResponseExample").then(
        (module) => ({
          Component: module.StreamingResponseExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "prompt-input",
    importPath: "@/components/shared/PromptInput",
    documentation: null,
    name: "Prompt Input",
    description:
      "Saisir un message, choisir un modèle et lancer une génération.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/PromptInputExample").then(
        (module) => ({
          Component: module.PromptInputExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "inline-citations",
    importPath: "@/components/shared/InlineCitations",
    documentation: null,
    name: "Inline Citations",
    description: "Citations numérotées et liens vers les sources.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/InlineCitationsExample").then(
        (module) => ({
          Component: module.InlineCitationsExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "task-list",
    importPath: "@/components/shared/todo-list/TodoList",
    documentation: null,
    name: "Task List",
    description: "Suivre les tâches terminées, en cours et à venir.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/TaskListExample").then(
        (module) => ({
          Component: module.TaskListExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "approval-card",
    importPath: "@/components/shared/approval/ApprovalCard",
    documentation: null,
    name: "Approval Card",
    description: "Approuver, refuser ou répondre à un questionnaire.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/ApprovalCardExample").then(
        (module) => ({
          Component: module.ApprovalCardExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "colors",
    importPath: null,
    documentation: null,
    name: "Couleurs",
    description: "Une palette neutre. Une fonction pour chaque nuance.",
    category: "Fondations",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "foundation",
    load: () =>
      import("@/components/design-system/examples/ColorsExample").then(
        (module) => ({
          Component: module.ColorsExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "spacing",
    importPath: null,
    documentation: null,
    name: "Espacements",
    description: "Un rythme de 4 pixels, du contrôle à la page.",
    category: "Fondations",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "foundation",
    load: () =>
      import("@/components/design-system/examples/SpacingExample").then(
        (module) => ({
          Component: module.SpacingExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "motion",
    importPath: null,
    documentation: null,
    name: "Mouvement",
    description: "Des transitions courtes qui rendent l’état compréhensible.",
    category: "Fondations",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "foundation",
    load: () =>
      import("@/components/design-system/examples/MotionExample").then(
        (module) => ({
          Component: module.MotionExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "typography",
    importPath: null,
    documentation: null,
    name: "Typographie",
    description: "Inter, une échelle courte et une hiérarchie précise.",
    category: "Fondations",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "foundation",
    load: () =>
      import("@/components/design-system/examples/TypographyExample").then(
        (module) => ({
          Component: module.TypographyExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "button",
    importPath: "@/components/ui/button",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/button`,
    name: "Button",
    description: "Une hiérarchie claire pour chaque action.",
    category: "Actions",
    variants: [
      "default",
      "secondary",
      "outline",
      "ghost",
      "destructive",
      "link",
    ],
    sizes: ["default", "xs", "sm", "lg"],
    states: ["default", "disabled", "loading"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ButtonExample").then(
        (module) => ({
          Component: module.ButtonExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "button-group",
    importPath: "@/components/ui/button-group",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/button-group`,
    name: "Button Group",
    description: "Rassembler des actions liées.",
    category: "Actions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ButtonGroupExample").then(
        (module) => ({
          Component: module.ButtonGroupExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "toggle",
    importPath: "@/components/ui/toggle",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/toggle`,
    name: "Toggle",
    description: "Activer un outil avec un état visuel stable.",
    category: "Actions",
    variants: ["default", "outline"],
    sizes: ["default", "sm", "lg"],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ToggleExample").then(
        (module) => ({
          Component: module.ToggleExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "toggle-group",
    importPath: "@/components/ui/toggle-group",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/toggle-group`,
    name: "Toggle Group",
    description: "Regrouper des choix de présentation.",
    category: "Actions",
    variants: ["default", "outline"],
    sizes: ["default", "sm", "lg"],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ToggleGroupExample").then(
        (module) => ({
          Component: module.ToggleGroupExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "calendar",
    importPath: "@/components/ui/calendar",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/calendar`,
    name: "Calendar",
    description: "Choisir une date dans un calendrier localisé.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CalendarExample").then(
        (module) => ({
          Component: module.CalendarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "checkbox",
    importPath: "@/components/ui/checkbox",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/checkbox`,
    name: "Checkbox",
    description: "Sélectionner une ou plusieurs possibilités.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CheckboxExample").then(
        (module) => ({
          Component: module.CheckboxExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "combobox",
    importPath: "@/components/ui/combobox",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/combobox`,
    name: "Combobox",
    description: "Rechercher rapidement dans une liste d’options.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ComboboxExample").then(
        (module) => ({
          Component: module.ComboboxExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "field",
    importPath: "@/components/ui/field",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/field`,
    name: "Field",
    description: "Associer un libellé, une aide et une validation.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled", "invalid"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/FieldExample").then(
        (module) => ({
          Component: module.FieldExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "input",
    importPath: "@/components/ui/input",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/input`,
    sizeProperty: "controlSize",
    name: "Input",
    description: "Un champ précis, avec des états explicites.",
    category: "Formulaires",
    variants: [],
    sizes: ["default", "sm", "lg"],
    states: ["default", "disabled", "invalid"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/InputExample").then(
        (module) => ({
          Component: module.InputExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "input-group",
    importPath: "@/components/ui/input-group",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/input-group`,
    name: "Input Group",
    description: "Réunir un champ, des icônes et des actions.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/InputGroupExample").then(
        (module) => ({
          Component: module.InputGroupExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "input-otp",
    importPath: "@/components/ui/input-otp",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/input-otp`,
    name: "Input OTP",
    description: "Saisir un code de vérification avec le clavier.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/InputOtpExample").then(
        (module) => ({
          Component: module.InputOtpExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "label",
    importPath: "@/components/ui/label",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/label`,
    name: "Label",
    description: "Nommer clairement chaque contrôle.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/LabelExample").then(
        (module) => ({
          Component: module.LabelExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "questionnaire",
    importPath: "@/components/ui/questionnaire",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/questionnaire`,
    name: "Questionnaire",
    description: "Guider une décision avec des choix explicites.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/QuestionnaireExample").then(
        (module) => ({
          Component: module.QuestionnaireExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "radio-group",
    importPath: "@/components/ui/radio-group",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/radio-group`,
    name: "Radio Group",
    description: "Une seule sélection, avec toutes les options visibles.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/RadioGroupExample").then(
        (module) => ({
          Component: module.RadioGroupExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "select",
    importPath: "@/components/ui/select",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/select`,
    variantProperty: "SelectTrigger.variant",
    name: "Select",
    description: "Choisir une option dans un espace réduit.",
    category: "Formulaires",
    variants: ["default", "subtle", "ghost"],
    sizes: ["default", "sm"],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SelectExample").then(
        (module) => ({
          Component: module.SelectExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "slider",
    importPath: "@/components/ui/slider",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/slider`,
    name: "Slider",
    description: "Ajuster une valeur dans un intervalle.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SliderExample").then(
        (module) => ({
          Component: module.SliderExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "switch",
    importPath: "@/components/ui/switch",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/switch`,
    name: "Switch",
    description: "Activer une préférence en un geste.",
    category: "Formulaires",
    variants: [],
    sizes: ["default", "sm"],
    states: ["default", "disabled"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SwitchExample").then(
        (module) => ({
          Component: module.SwitchExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "textarea",
    importPath: "@/components/ui/textarea",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/textarea`,
    name: "Textarea",
    description: "Du texte libre, avec de la place pour les idées.",
    category: "Formulaires",
    variants: [],
    sizes: [],
    states: ["default", "disabled", "invalid"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/TextareaExample").then(
        (module) => ({
          Component: module.TextareaExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "breadcrumb",
    importPath: "@/components/ui/breadcrumb",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/breadcrumb`,
    name: "Breadcrumb",
    description: "Situer la page dans une navigation hiérarchique.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/BreadcrumbExample").then(
        (module) => ({
          Component: module.BreadcrumbExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "command",
    importPath: "@/components/ui/command",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/command`,
    name: "Command",
    description: "Trouver une action avec quelques lettres.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CommandExample").then(
        (module) => ({
          Component: module.CommandExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "menubar",
    importPath: "@/components/ui/menubar",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/menubar`,
    name: "Menubar",
    description: "Les commandes d’un outil, organisées en menus.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/MenubarExample").then(
        (module) => ({
          Component: module.MenubarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "navigation-menu",
    importPath: "@/components/ui/navigation-menu",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/navigation-menu`,
    name: "Navigation Menu",
    description: "Organiser les destinations principales.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/NavigationMenuExample").then(
        (module) => ({
          Component: module.NavigationMenuExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "pagination",
    importPath: "@/components/ui/pagination",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/pagination`,
    name: "Pagination",
    description: "Parcourir une collection page par page.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/PaginationExample").then(
        (module) => ({
          Component: module.PaginationExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "sidebar",
    importPath: "@/components/ui/sidebar",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/sidebar`,
    name: "Sidebar",
    description: "Une navigation persistante, compacte et hiérarchisée.",
    category: "Navigation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SidebarExample").then(
        (module) => ({
          Component: module.SidebarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "tabs",
    importPath: "@/components/ui/tabs",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/tabs`,
    variantProperty: "TabsList.variant",
    name: "Tabs",
    description: "Passer d’une vue à une autre, au même endroit.",
    category: "Navigation",
    variants: ["default", "line"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/TabsExample").then(
        (module) => ({ Component: module.TabsExample, getCode: module.getCode })
      ),
  },
  {
    id: "avatar",
    importPath: "@/components/ui/avatar",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/avatar`,
    name: "Avatar",
    description: "Identifier les personnes, même sans image.",
    category: "Affichage",
    variants: [],
    sizes: ["default", "sm", "lg"],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AvatarExample").then(
        (module) => ({
          Component: module.AvatarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "badge",
    importPath: "@/components/ui/badge",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/badge`,
    name: "Badge",
    description: "Des statuts lisibles, sans dépendre de la couleur.",
    category: "Affichage",
    variants: [
      "default",
      "secondary",
      "outline",
      "ghost",
      "destructive",
      "link",
    ],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/BadgeExample").then(
        (module) => ({
          Component: module.BadgeExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "chart",
    importPath: "@/components/ui/chart",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/chart`,
    name: "Chart",
    description:
      "Des données lisibles grâce aux valeurs et aux niveaux de gris.",
    category: "Affichage",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ChartExample").then(
        (module) => ({
          Component: module.ChartExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "item",
    importPath: "@/components/ui/item",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/item`,
    name: "Item",
    description: "Un élément de liste avec du contexte et une action.",
    category: "Affichage",
    variants: ["default", "outline", "muted"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ItemExample").then(
        (module) => ({ Component: module.ItemExample, getCode: module.getCode })
      ),
  },
  {
    id: "kbd",
    importPath: "@/components/ui/kbd",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/kbd`,
    name: "Kbd",
    description: "Afficher les raccourcis là où ils sont utiles.",
    category: "Affichage",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/KbdExample").then(
        (module) => ({ Component: module.KbdExample, getCode: module.getCode })
      ),
  },
  {
    id: "table",
    importPath: "@/components/ui/table",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/table`,
    name: "Table",
    description: "Présenter les données avec une hiérarchie régulière.",
    category: "Affichage",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/TableExample").then(
        (module) => ({
          Component: module.TableExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "accordion",
    importPath: "@/components/ui/accordion",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/accordion`,
    name: "Accordion",
    description: "Révéler les détails au bon moment.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AccordionExample").then(
        (module) => ({
          Component: module.AccordionExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "aspect-ratio",
    importPath: "@/components/ui/aspect-ratio",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/aspect-ratio`,
    name: "Aspect Ratio",
    description: "Conserver des proportions stables pour les aperçus.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AspectRatioExample").then(
        (module) => ({
          Component: module.AspectRatioExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "card",
    importPath: "@/components/ui/card",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/card`,
    name: "Card",
    description: "Une surface pour regrouper une information et ses actions.",
    category: "Structure",
    variants: [],
    sizes: ["default", "sm"],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CardExample").then(
        (module) => ({ Component: module.CardExample, getCode: module.getCode })
      ),
  },
  {
    id: "carousel",
    importPath: "@/components/ui/carousel",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/carousel`,
    name: "Carousel",
    description: "Parcourir une série d’aperçus au clavier ou au toucher.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CarouselExample").then(
        (module) => ({
          Component: module.CarouselExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "collapsible",
    importPath: "@/components/ui/collapsible",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/collapsible`,
    name: "Collapsible",
    description: "Déplier un groupe de contenu à la demande.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/CollapsibleExample").then(
        (module) => ({
          Component: module.CollapsibleExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "direction",
    importPath: "@/components/ui/direction",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/direction`,
    variantProperty: "direction",
    name: "Direction",
    description: "Adapter le sens de lecture d’une composition.",
    category: "Structure",
    variants: ["ltr", "rtl"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/DirectionExample").then(
        (module) => ({
          Component: module.DirectionExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "resizable",
    importPath: "@/components/ui/resizable",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/resizable`,
    name: "Resizable",
    description: "Ajuster la place de chaque panneau.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ResizableExample").then(
        (module) => ({
          Component: module.ResizableExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "scroll-area",
    importPath: "@/components/ui/scroll-area",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/scroll-area`,
    name: "Scroll Area",
    description: "Parcourir un contenu long dans un espace délimité.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ScrollAreaExample").then(
        (module) => ({
          Component: module.ScrollAreaExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "separator",
    importPath: "@/components/ui/separator",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/separator`,
    name: "Separator",
    description: "Structurer sans ajouter de bruit visuel.",
    category: "Structure",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SeparatorExample").then(
        (module) => ({
          Component: module.SeparatorExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "alert-dialog",
    importPath: "@/components/ui/alert-dialog",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/alert-dialog`,
    name: "Alert Dialog",
    description: "Confirmer une action et en expliquer la conséquence.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AlertDialogExample").then(
        (module) => ({
          Component: module.AlertDialogExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "context-menu",
    importPath: "@/components/ui/context-menu",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/context-menu`,
    name: "Context Menu",
    description: "Des actions liées à l’élément sélectionné.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ContextMenuExample").then(
        (module) => ({
          Component: module.ContextMenuExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "dialog",
    importPath: "@/components/ui/dialog",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/dialog`,
    name: "Dialog",
    description: "Concentrer une tâche dans une fenêtre accessible.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/DialogExample").then(
        (module) => ({
          Component: module.DialogExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "drawer",
    importPath: "@/components/ui/drawer",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/drawer`,
    name: "Drawer",
    description: "Une surface adaptée aux interactions tactiles.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/DrawerExample").then(
        (module) => ({
          Component: module.DrawerExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "dropdown-menu",
    importPath: "@/components/ui/dropdown-menu",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/dropdown-menu`,
    name: "Dropdown Menu",
    description: "Présenter les actions secondaires au bon endroit.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/DropdownMenuExample").then(
        (module) => ({
          Component: module.DropdownMenuExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "hover-card",
    importPath: "@/components/ui/hover-card",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/hover-card`,
    name: "Hover Card",
    description: "Donner du contexte à un lien au survol ou au focus.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/HoverCardExample").then(
        (module) => ({
          Component: module.HoverCardExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "popover",
    importPath: "@/components/ui/popover",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/popover`,
    name: "Popover",
    description: "Proposer une interaction contextuelle et légère.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/PopoverExample").then(
        (module) => ({
          Component: module.PopoverExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "sheet",
    importPath: "@/components/ui/sheet",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/sheet`,
    name: "Sheet",
    description: "Afficher des détails sans quitter le contexte.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SheetExample").then(
        (module) => ({
          Component: module.SheetExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "tooltip",
    importPath: "@/components/ui/tooltip",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/tooltip`,
    name: "Tooltip",
    description: "Préciser une action sans surcharger l’interface.",
    category: "Superpositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/TooltipExample").then(
        (module) => ({
          Component: module.TooltipExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "alert",
    importPath: "@/components/ui/alert",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/alert`,
    name: "Alert",
    description: "Un message contextualisé, visible et concis.",
    category: "Feedback",
    variants: ["default", "destructive"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AlertExample").then(
        (module) => ({
          Component: module.AlertExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "empty",
    importPath: "@/components/ui/empty",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/empty`,
    name: "Empty",
    description: "Donner un point de départ lorsque le contenu manque.",
    category: "Feedback",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/EmptyExample").then(
        (module) => ({
          Component: module.EmptyExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "progress",
    importPath: "@/components/ui/progress",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/progress`,
    name: "Progress",
    description: "Rendre l’avancement d’une opération visible.",
    category: "Feedback",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ProgressExample").then(
        (module) => ({
          Component: module.ProgressExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "skeleton",
    importPath: "@/components/ui/skeleton",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/skeleton`,
    name: "Skeleton",
    description: "Réserver la place du contenu pendant son chargement.",
    category: "Feedback",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SkeletonExample").then(
        (module) => ({
          Component: module.SkeletonExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "spinner",
    importPath: "@/components/ui/spinner",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/spinner`,
    name: "Spinner",
    description: "Un indicateur discret pour une action en cours.",
    category: "Feedback",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/SpinnerExample").then(
        (module) => ({
          Component: module.SpinnerExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "toast",
    importPath: "@/components/ui/toast",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/toast`,
    variantProperty: "type",
    name: "Toast",
    description: "Confirmer une action sans interrompre le travail.",
    category: "Feedback",
    variants: ["success", "info", "warning", "error"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/ToastExample").then(
        (module) => ({
          Component: module.ToastExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "attachment",
    importPath: "@/components/ui/attachment",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/attachment`,
    variantProperty: "state",
    name: "Attachment",
    description: "Un fichier identifiable et son état de traitement.",
    category: "Conversation",
    variants: ["done", "uploading", "processing", "error"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/AttachmentExample").then(
        (module) => ({
          Component: module.AttachmentExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "bubble",
    importPath: "@/components/ui/bubble",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/bubble`,
    name: "Bubble",
    description: "Une surface de message avec une intention précise.",
    category: "Conversation",
    variants: ["default", "secondary", "outline", "ghost", "destructive"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/BubbleExample").then(
        (module) => ({
          Component: module.BubbleExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "marker",
    importPath: "@/components/ui/marker",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/marker`,
    name: "Marker",
    description: "Un repère léger dans une conversation.",
    category: "Conversation",
    variants: ["default", "separator", "border"],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/MarkerExample").then(
        (module) => ({
          Component: module.MarkerExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "message",
    importPath: "@/components/ui/message",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/message`,
    name: "Message",
    description: "Structurer l’auteur, le contenu et les métadonnées.",
    category: "Conversation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/MessageExample").then(
        (module) => ({
          Component: module.MessageExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "message-scroller",
    importPath: "@/components/ui/message-scroller",
    documentation: `${EXTERNAL_LINKS.shadcnBaseComponents}/message-scroller`,
    name: "Message Scroller",
    description: "Garder le fil d’une conversation qui évolue.",
    category: "Conversation",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "component",
    load: () =>
      import("@/components/design-system/examples/MessageScrollerExample").then(
        (module) => ({
          Component: module.MessageScrollerExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "data-table",
    importPath: "@/components/shared/DataTable",
    documentation: null,
    properties: [
      {
        name: "data / columns",
        type: "TData[] / ColumnDef[]",
        defaultValue: "Requis",
        description: "Données et colonnes typées avec DataTableFeatures.",
      },
      {
        name: "filterColumn",
        type: "string",
        defaultValue: "—",
        description: "Identifiant de la colonne filtrée par la recherche.",
      },
      {
        name: "pageSize",
        type: "number",
        defaultValue: "5",
        description: "Nombre de lignes par page.",
      },
      {
        name: "emptyMessage",
        type: "string",
        defaultValue: "Aucun résultat.",
        description: "Texte affiché quand la liste est vide.",
      },
    ],
    name: "Data Table",
    description: "Un tableau typé avec tri, filtre et pagination.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/DataTableExample").then(
        (module) => ({
          Component: module.DataTableExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "date-picker",
    importPath: "@/components/shared/DatePicker",
    documentation: null,
    properties: [
      {
        name: "value",
        type: "Date | undefined",
        defaultValue: "—",
        description: "Date sélectionnée, gérée par le parent.",
      },
      {
        name: "onValueChange",
        type: "(date?: Date) => void",
        defaultValue: "Requis",
        description: "Retourne la sélection et ferme le calendrier.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: "Choisir une date",
        description: "Libellé du bouton et nom accessible.",
      },
    ],
    name: "Date Picker",
    description: "Calendrier et bouton réunis en un contrôle localisé.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default", "disabled"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/DatePickerExample").then(
        (module) => ({
          Component: module.DatePickerExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "filter-bar",
    importPath: "@/components/shared/FilterBar",
    documentation: null,
    properties: [
      {
        name: "children / actions",
        type: "ReactNode",
        defaultValue: "—",
        description: "Filtres et actions placés dans deux groupes.",
      },
    ],
    variantProperty: "density",
    name: "Filter Bar",
    description: "Assembler la recherche, les filtres et les actions.",
    category: "Compositions",
    variants: ["compact", "comfortable"],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/FilterBarExample").then(
        (module) => ({
          Component: module.FilterBarExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "page-header",
    importPath: "@/components/shared/PageHeader",
    documentation: null,
    properties: [
      {
        name: "title",
        type: "string",
        defaultValue: "Requis",
        description: "Titre principal de la page.",
      },
      {
        name: "description / eyebrow",
        type: "string",
        defaultValue: "—",
        description: "Contexte et repère de navigation.",
      },
      {
        name: "actions",
        type: "ReactNode",
        defaultValue: "—",
        description: "Actions composées avec les primitives Button.",
      },
    ],
    name: "Page Header",
    description: "Titre, contexte et action principale, alignés.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/PageHeaderExample").then(
        (module) => ({
          Component: module.PageHeaderExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "search-field",
    importPath: "@/components/shared/SearchField",
    documentation: null,
    properties: [
      {
        name: "value",
        type: "string",
        defaultValue: "Requis",
        description: "Valeur contrôlée de la recherche.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        defaultValue: "Requis",
        description: "Appelé à chaque saisie et à l’effacement.",
      },
      {
        name: "label / placeholder",
        type: "string",
        defaultValue: "Rechercher",
        description: "Libellé accessible et aide à la saisie.",
      },
    ],
    name: "Search Field",
    description: "Une recherche avec icône et effacement intégrés.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/SearchFieldExample").then(
        (module) => ({
          Component: module.SearchFieldExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "settings-section",
    importPath: "@/components/shared/SettingsSection",
    documentation: null,
    properties: [
      {
        name: "title",
        type: "string",
        defaultValue: "Requis",
        description: "Titre accessible de la section.",
      },
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Requis",
        description: "Champs shadcn Field.",
      },
      {
        name: "description / footer",
        type: "string / ReactNode",
        defaultValue: "—",
        description: "Contexte et actions de fin de section.",
      },
    ],
    name: "Settings Section",
    description: "Une section de formulaire avec un rythme constant.",
    category: "Compositions",
    variants: [],
    sizes: [],
    states: ["default"],
    kind: "composition",
    load: () =>
      import("@/components/design-system/examples/SettingsSectionExample").then(
        (module) => ({
          Component: module.SettingsSectionExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "status-icon",
    importPath: "@/components/shared/StatusIcon",
    documentation: null,
    properties: [
      {
        name: "status",
        type: "StatusValue",
        defaultValue: "Requis",
        description: "Backlog, à faire, en cours, terminé, annulé ou doublon.",
      },
      {
        name: "progress",
        type: "number",
        defaultValue: "50",
        description: "Remplissage du cercle en cours, entre 0 et 100.",
      },
      {
        name: "tone",
        type: "semantic | neutral",
        defaultValue: "semantic",
        description: "Couleurs de statut ou variante monochrome.",
      },
      {
        name: "label",
        type: "string",
        defaultValue: "—",
        description: "Nom accessible lorsque l’icône est utilisée seule.",
      },
    ],
    variantProperty: null,
    name: "Status Icon",
    description: "Cercles de statut, progression et états terminés.",
    category: "Compositions",
    kind: "composition",
    variants: ["semantic", "neutral"],
    sizes: [],
    states: ["default"],
    load: () =>
      import("@/components/design-system/examples/StatusIconExample").then(
        (module) => ({
          Component: module.StatusIconExample,
          getCode: module.getCode,
        })
      ),
  },
  {
    id: "status-picker",
    importPath: "@/components/shared/StatusPicker",
    documentation: null,
    properties: [
      {
        name: "value",
        type: "StatusValue",
        defaultValue: "Requis",
        description: "Statut sélectionné, géré par le parent.",
      },
      {
        name: "onValueChange",
        type: "(value: StatusValue) => void",
        defaultValue: "Requis",
        description: "Appelé à la sélection, au clic ou au clavier.",
      },
    ],
    name: "Status Picker",
    description: "Menu de statut avec indicateurs circulaires.",
    category: "Compositions",
    kind: "composition",
    variants: ["ghost", "default", "subtle"],
    sizes: [],
    states: ["default", "disabled"],
    load: () =>
      import("@/components/design-system/examples/StatusPickerExample").then(
        (module) => ({
          Component: module.StatusPickerExample,
          getCode: module.getCode,
        })
      ),
  },
]
export const catalog: CatalogEntry[] = definitions.map(
  ({ variantProperty, sizeProperty, ...entry }) => ({
    ...entry,
    properties: getProperties({ ...entry, variantProperty, sizeProperty }),
  })
)
export const categories = [...new Set(catalog.map((entry) => entry.category))]
