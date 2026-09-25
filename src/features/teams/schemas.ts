import { z } from "zod"

export const teamRoleSchema = z.enum(["owner", "admin", "member", "viewer"], {
  error: "Choisissez un rôle valide.",
})
export const teamNameSchema = z
  .string()
  .trim()
  .min(1, "Saisissez le nom de l’équipe.")
  .max(100, "Le nom doit contenir au maximum 100 caractères.")
export const teamFormSchema = z.object({ name: teamNameSchema })
export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Saisissez une adresse e-mail valide." }))
    .refine(
      (email) => email.endsWith("@digitevent.com"),
      "Utilisez une adresse @digitevent.com."
    ),
  role: teamRoleSchema,
})
export type InviteMemberValues = z.input<typeof inviteMemberSchema>

export const createTeamSlug = (name: string) =>
  `${
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "equipe"
  }-${crypto.randomUUID().slice(0, 8)}`
