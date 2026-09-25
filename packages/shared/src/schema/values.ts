import { z } from "zod"

export const finite = z.number().finite().min(-1_000_000).max(1_000_000)

export const positive = z.number().finite().min(0).max(100_000)

export const token = z
  .object({ token: z.string().regex(/^[a-zA-Z][\w-]*$/) })
  .strict()

export const length = z.union([positive, token])

export const color = z.union([
  token.extend({ alpha: z.number().min(0).max(1).optional() }),
  z
    .string()
    .regex(
      /^(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|transparent|currentColor)$/
    ),
])

const size = z
  .object({
    mode: z.enum(["fixed", "hug", "fill"]),
    value: positive.optional(),
  })
  .strict()

export const style = z
  .object({
    background: color.optional(),
    backgroundVisible: z.boolean().optional(),
    border: z
      .object({ color, width: positive, visible: z.boolean().optional() })
      .strict()
      .optional(),
    radius: length.optional(),
    shadow: z
      .union([
        token,
        z
          .string()
          .max(160)
          .regex(/^(none|[-\d\s.pxrem#(),a-zA-Z%]+)$/),
      ])
      .optional(),
    opacity: z.number().min(0).max(1).optional(),
  })
  .strict()

const layout = z
  .object({
    width: size.optional(),
    height: size.optional(),
    minW: positive.optional(),
    maxW: positive.optional(),
    minH: positive.optional(),
    maxH: positive.optional(),
    alignSelf: z.enum(["start", "center", "end", "stretch"]).optional(),
    position: z
      .union([z.literal("flow"), z.object({ x: finite, y: finite }).strict()])
      .optional(),
  })
  .strict()

export const base = {
  id: z.string().min(1).max(100),
  name: z.string().max(200).optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  lockAspectRatio: z.boolean().optional(),
  layout: layout.optional(),
  style: style.optional(),
}

export const autoLayout = z
  .object({
    direction: z.enum(["column", "row", "grid"]),
    wrap: z.boolean().optional(),
    gap: z.union([length, z.literal("auto")]).optional(),
    crossGap: length.optional(),
    gridColumns: z.number().int().min(1).max(100).optional(),
    padding: z.tuple([length, length, length, length]).optional(),
    justify: z
      .enum(["start", "center", "end", "between", "around", "evenly"])
      .optional(),
    align: z.enum(["start", "center", "end", "stretch"]).optional(),
  })
  .strict()

export const jsonProps = z.record(z.string().max(100), z.json())

export const localVariant = z
  .object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    props: jsonProps,
    text: z.string().max(100_000).optional(),
    layout: layout.optional(),
    style: style.optional(),
  })
  .strict()
