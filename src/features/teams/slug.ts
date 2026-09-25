import { v4 as uuid } from "uuid"

export const createTeamSlug = (name: string) =>
  `${
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "equipe"
  }-${uuid().slice(0, 8)}`
