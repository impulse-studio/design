import { FRAME_GAP, FRAME_PRESETS } from "./constants"
import type { ComponentNode, FrameNode, MockupDoc, Node } from "./doc"

// Demo mockup used until mockups are stored in the database (M2), and by the renderer when opened standalone.
let seq = 0
const id = (prefix: string) => `${prefix}-${++seq}`

const c = (component: string, props: ComponentNode["props"] = {}, extra: Partial<ComponentNode> = {}): ComponentNode => ({
  id: id(component),
  type: "component",
  component,
  props,
  ...extra,
})

const cell = (content: Node | string) =>
  c("DigiTableCell", {}, typeof content === "string" ? { text: content } : { slots: { default: [content] } })

const guests = [
  ["Camille Martin", "camille.martin@acme.fr", "Inscrit", "green"],
  ["Lucas Bernard", "lucas.bernard@globex.com", "En attente", "yellow"],
  ["Léa Dubois", "lea.dubois@initech.io", "Refusé", "red"],
  ["Hugo Laurent", "hugo.laurent@umbrella.fr", "Inscrit", "green"],
  ["Chloé Moreau", "chloe.moreau@stark.com", "En attente", "yellow"],
] as const

export const demoFrame: FrameNode = {
  id: "frame-desktop",
  type: "frame",
  name: "Liste des invités",
  x: 0,
  y: 0,
  width: FRAME_PRESETS.desktop.width,
  height: FRAME_PRESETS.desktop.height,
  preset: "desktop",
  children: [
    {
      id: "event-layout",
      type: "template",
      template: "EventLayout",
      props: { activeRoute: "guestsList" },
      slots: {
        content: [
          c(
            "DigiTablePageLayout",
            {
              title: "Liste des invités",
              description: "Relancez les invités qui n'ont pas encore répondu à votre invitation.",
              createCta: "Ajouter un invité",
            },
            {
              slots: {
                table: [
                  c("DigiTable", {}, {
                    slots: {
                      default: [
                        c("DigiTableHeader", {}, {
                          slots: {
                            default: [
                              c("DigiTableRow", {}, {
                                slots: {
                                  default: ["Nom", "E-mail", "Statut", ""].map((label) => c("DigiTableHead", {}, { text: label })),
                                },
                              }),
                            ],
                          },
                        }),
                        c("DigiTableBody", {}, {
                          slots: {
                            default: guests.map(([name, email, status, color]) =>
                              c("DigiTableRow", {}, {
                                slots: {
                                  default: [
                                    cell(name),
                                    cell(email),
                                    cell(c("DigiBadge", { color, text: status })),
                                    cell(
                                      status === "En attente"
                                        ? c("DigiButton", { variant: "secondary", size: "sm", iconName: "mail-send-line" }, { text: "Relancer" })
                                        : "",
                                    ),
                                  ],
                                },
                              }),
                            ),
                          },
                        }),
                      ],
                    },
                  }),
                ],
              },
            },
          ),
        ],
      },
    },
  ],
}

export const demoMobileFrame: FrameNode = {
  id: "frame-mobile",
  type: "frame",
  name: "Relance · mobile",
  x: FRAME_PRESETS.desktop.width + FRAME_GAP,
  y: 0,
  width: FRAME_PRESETS.mobile.width,
  height: FRAME_PRESETS.mobile.height,
  preset: "mobile",
  children: [
    {
      id: "mobile-stack",
      type: "box",
      autoLayout: {
        direction: "column",
        gap: { token: "spacing-md" },
        padding: [{ token: "spacing-lg" }, { token: "spacing-md" }, { token: "spacing-lg" }, { token: "spacing-md" }],
      },
      children: [
        { id: "mobile-title", type: "text", content: "Relancer les invités", textStyle: { token: "font-size-xl" }, weight: 600 },
        {
          id: "mobile-desc",
          type: "text",
          content: "2 invités n'ont pas encore répondu à votre invitation.",
          color: { token: "muted-foreground" },
        },
        c("DigiAlert", { title: "Dernière relance il y a 3 jours", variant: "info" }),
        c("DigiButton", { variant: "primary", iconName: "mail-send-line" }, { text: "Relancer 2 invités" }),
        c("DigiButton", { variant: "secondary" }, { text: "Voir la liste" }),
      ],
    },
  ],
}

export const demoDoc: MockupDoc = {
  schemaVersion: 1,
  libVersion: "dev",
  frames: [demoFrame, demoMobileFrame],
}
