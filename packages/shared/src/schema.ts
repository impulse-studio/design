import { z } from "zod"
import type { FrameNode, MockupDoc, Node } from "./doc"
import type { LibraryManifest, ManifestComponent } from "./manifest"
import { propOptions } from "./manifest"
import { walk } from "./tree"

const finite = z.number().finite().min(-1_000_000).max(1_000_000)
const positive = z.number().finite().min(0).max(100_000)
const token = z.object({ token: z.string().regex(/^[a-zA-Z][\w-]*$/) }).strict()
const length = z.union([positive, token])
const color = z.union([
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
const style = z
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
const base = {
  id: z.string().min(1).max(100),
  name: z.string().max(200).optional(),
  hidden: z.boolean().optional(),
  locked: z.boolean().optional(),
  lockAspectRatio: z.boolean().optional(),
  layout: layout.optional(),
  style: style.optional(),
}
const autoLayout = z
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
const jsonProps = z.record(z.string().max(100), z.json())
const localVariant = z
  .object({
    id: z.string().min(1).max(100),
    name: z.string().min(1).max(200),
    props: jsonProps,
    text: z.string().max(100_000).optional(),
    layout: layout.optional(),
    style: style.optional(),
  })
  .strict()
const elementTag = z
  .string()
  .regex(/^[a-z][a-z0-9-]{0,40}$/)
  .refine(
    (tag) =>
      !["script", "style", "iframe", "object", "embed", "link", "meta"].includes(tag),
    "Balise non autorisée"
  )
const elementAttributes = z
  .record(
    z.string().regex(/^[a-zA-Z_:][a-zA-Z0-9:._-]{0,100}$/),
    z.union([z.string().max(2000), finite, z.boolean()])
  )
  .refine(
    (attributes) =>
      Object.keys(attributes).every(
        (key) => !/^on/i.test(key) && key.toLowerCase() !== "srcdoc"
      ),
    "Attribut dangereux"
  )
  .refine(
    (attributes) =>
      Object.entries(attributes).every(
        ([key, value]) =>
          !["href", "src", "xlink:href"].includes(key.toLowerCase()) ||
          typeof value !== "string" ||
          /^(?:https?:\/\/|mailto:|tel:|#|\/|\.\/|\.\.\/|data:image\/(?:png|jpeg|gif|webp);base64,)/i.test(
            value
          )
      ),
    "URL non autorisée"
  )
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
        tag: elementTag,
        className: z.string().max(4000).optional(),
        attributes: elementAttributes.optional(),
        inlineStyle: z
          .string()
          .max(4000)
          .refine(
            (value) =>
              !/(?:url\s*\(|expression\s*\(|javascript:|@import|<)/i.test(value),
            "Style non autorisé"
          )
          .optional(),
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
export const documentSchema: z.ZodType<MockupDoc> = z
  .object({
    schemaVersion: z.literal(1),
    libVersion: z.string().max(100),
    pages: z
      .array(
        z
          .object({
            id: base.id,
            name: z.string().min(1).max(200),
            background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
            frames: z.array(frameSchema).max(100),
          })
          .strict()
      )
      .length(1),
  })
  .strict()
  .superRefine((doc, ctx) => {
    const ids = new Set<string>()
    const variants = new Map<string, string>()
    for (const page of doc.pages)
      for (const frame of page.frames)
        walk(frame, (node, _parent, depth) => {
          if (ids.has(node.id))
            ctx.addIssue({
              code: "custom",
              message: "Identifiant de calque dupliqué",
            })
          ids.add(node.id)
          if (depth > 50 || ids.size > 10_000)
            ctx.addIssue({ code: "custom", message: "Document trop complexe" })
          if (node.type === "component" && node.localVariant) {
            const serialized = JSON.stringify(node.localVariant)
            const previous = variants.get(node.localVariant.id)
            if (previous && previous !== serialized)
              ctx.addIssue({
                code: "custom",
                path: ["pages"],
                message: `La variante locale « ${node.localVariant.name} » a plusieurs définitions`,
              })
            variants.set(node.localVariant.id, serialized)
          }
        })
  })
export const validateDocument = (
  input: unknown,
  manifest: LibraryManifest
): MockupDoc => {
  const doc = documentSchema.parse(input)
  const entries = new Map<string, ManifestComponent>(
    [...manifest.components, ...manifest.templates].map((entry) => [
      entry.name,
      entry,
    ])
  )
  for (const page of doc.pages)
    for (const frame of page.frames)
      walk(frame, (node) => {
        if (node.type !== "component" && node.type !== "template") return
        const name = node.type === "component" ? node.component : node.template
        const entry = entries.get(name)
        if (!entry) throw new Error(`Composant inconnu : ${name}`)
        const propValues = {
          ...(node.type === "component" ? node.localVariant?.props : {}),
          ...(node.props ?? {}),
        }
        for (const [key, value] of Object.entries(propValues)) {
          const prop = entry.props.find((candidate) => candidate.name === key)
          if (!prop || /^on[A-Z]/.test(key) || /=>/.test(prop.type))
            throw new Error(`Propriété non éditable : ${name}.${key}`)
          const options = propOptions(prop)
          const type = prop.type.replace(/\s*\|\s*undefined/g, "").trim()
          if (type === "false | true" && typeof value !== "boolean")
            throw new Error(`Type invalide : ${name}.${key}`)
          if (options.length && !options.includes(String(value)))
            throw new Error(`Valeur invalide : ${name}.${key}`)
          if (
            ["string", "number", "boolean"].includes(type) &&
            typeof value !== type
          )
            throw new Error(`Type invalide : ${name}.${key}`)
        }
        for (const prop of entry.props)
          if (
            prop.required &&
            !/=>/.test(prop.type) &&
            propValues[prop.name] === undefined
          )
            throw new Error(`Propriété requise : ${name}.${prop.name}`)
        for (const slot of Object.keys(node.slots ?? {}))
          if (!entry.slots.includes(slot))
            throw new Error(`Slot inconnu : ${name}.${slot}`)
      })
  return doc
}
