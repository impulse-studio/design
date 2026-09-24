// Stub of back/src/utils/time.ts (moment-timezone in the real app).
export function getDate(date: string | Date, timezone: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: timezone }).format(new Date(date))
}
