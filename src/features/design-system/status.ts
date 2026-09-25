export const statusOptions = [
  { value: "backlog", label: "Backlog", shortcut: "1" },
  { value: "todo", label: "À faire", shortcut: "2" },
  { value: "in-progress", label: "En cours", shortcut: "3" },
  { value: "done", label: "Terminé", shortcut: "4" },
  { value: "canceled", label: "Annulé", shortcut: "5" },
  { value: "duplicate", label: "Doublon", shortcut: "6" },
] as const
export type StatusValue = (typeof statusOptions)[number]["value"]
export const statusLabels = Object.fromEntries(
  statusOptions.map((status) => [status.value, status.label])
) as Record<StatusValue, string>
