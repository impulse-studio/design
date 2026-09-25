import { z } from "zod"

export const filePathSchema = z
  .string()
  .max(200)
  .regex(/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+$/)
  .refine(
    (path) =>
      !path
        .split("/")
        .some((p) => p === ".." || p === "." || p === "node_modules") &&
      !path.startsWith("."),
    "Chemin de fichier interdit."
  )
