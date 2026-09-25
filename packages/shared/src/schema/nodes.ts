import { z } from "zod"
import type { FrameNode, Node } from "../doc"

import {
  finite,
  positive,
  token,
  length,
  color,
  style,
  base,
  autoLayout,
  jsonProps,
  localVariant,
} from "./values"
import {
  elementTagSchema,
  elementAttributesSchema,
  elementInlineStyleSchema,
} from "./elements"

export const nodeSchema: z.ZodType<Node> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z
      .object({
        ...base,
        type: z.literal("component"),
        component: z.string().max(100),
        props: jsonProps.optional(),
        text: z.string().max(100_000).optional(),
        localVariant: localVariant.optional(),
        slots: z.record(z.string(), z.array(nodeSchema)).optional(),
      })
      .strict(),
    z
      .object({
        ...base,
        type: z.literal("template"),
        template: z.string().max(100),
        props: jsonProps.optional(),
        slots: z.record(z.string(), z.array(nodeSchema)).optional(),
      })
      .strict(),
    z
      .object({
        ...base,
        type: z.literal("box"),
        autoLayout: autoLayout.optional(),
        clip: z.boolean().optional(),
        children: z.array(nodeSchema),
      })
      .strict(),
    z
      .object({
        ...base,
        type: z.literal("text"),
        content: z.string().max(100_000),
        textStyle: token.optional(),
        color: color.optional(),
        weight: z
          .union([
            z.literal(400),
            z.literal(500),
            z.literal(600),
            z.literal(700),
          ])
          .optional(),
        fontSize: length.optional(),
        textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
        lineHeight: positive.optional(),
      })
      .strict(),
    z
      .object({
        ...base,
        type: z.literal("image"),
        src: z
          .string()
          .max(2000)
          .regex(/^(https?:\/\/|\/[^/])/),
        fit: z.enum(["cover", "contain"]).optional(),
        radius: length.optional(),
      })
      .strict(),
    z
      .object({
        ...base,
        type: z.literal("element"),
        tag: elementTagSchema,
        className: z.string().max(4000).optional(),
        attributes: elementAttributesSchema.optional(),
        inlineStyle: elementInlineStyleSchema.optional(),
        children: z.array(nodeSchema),
      })
      .strict(),
  ])
)

export const frameSchema: z.ZodType<FrameNode> = z
  .object({
    id: base.id,
    type: z.literal("frame"),
    name: z.string().min(1).max(200),
    x: finite,
    y: finite,
    width: z.union([positive.min(1), z.literal("hug")]),
    height: z.union([positive.min(1), z.literal("hug")]),
    minW: positive.optional(),
    maxW: positive.optional(),
    minH: positive.optional(),
    maxH: positive.optional(),
    autoLayout: autoLayout.optional(),
    preset: z.enum(["desktop", "laptop", "tablet", "mobile"]).optional(),
    theme: z.enum(["light", "dark"]).optional(),
    hidden: z.boolean().optional(),
    locked: z.boolean().optional(),
    lockAspectRatio: z.boolean().optional(),
    clip: z.boolean().optional(),
    style: style.optional(),
    children: z.array(nodeSchema),
  })
  .strict()
