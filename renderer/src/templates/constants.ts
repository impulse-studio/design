// Fake data the shell templates show when a mockup does not override it.

export const DEFAULT_EVENT = {
  id: "studio-event",
  name: "Salon Digitevent 2026",
  startDate: "2026-10-15T09:00:00.000Z",
  timezone: "Europe/Paris",
  accountName: "Mon compte",
} as const

export type MenuSectionInput = {
  key?: string
  title: string
  icon: string
  items: { title: string; route: string }[]
}

export const DEFAULT_MENU_SECTIONS: MenuSectionInput[] = [
  { title: "Tableau de bord", icon: "dashboard-line", items: [{ title: "Tableau de bord", route: "dashboard" }] },
  {
    title: "Invités",
    icon: "group-line",
    items: [
      { title: "Liste des invités", route: "guestsList" },
      { title: "Segments", route: "segments" },
      { title: "Import", route: "guestsImport" },
    ],
  },
  {
    title: "Inscription",
    icon: "file-list-3-line",
    items: [
      { title: "Formulaire", route: "registrationForm" },
      { title: "Billetterie", route: "ticketing" },
    ],
  },
  {
    title: "Communication",
    icon: "mail-send-line",
    items: [
      { title: "Campagnes e-mail", route: "campaigns" },
      { title: "SMS", route: "sms" },
    ],
  },
  { title: "Site web", icon: "global-line", items: [{ title: "Site web", route: "website" }] },
  { title: "Paramètres", icon: "settings-3-line", items: [{ title: "Paramètres", route: "eventSettings" }] },
]
